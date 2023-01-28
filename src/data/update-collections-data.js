const axios = require("axios").default;
const collectionsInit = require("./utils/collections")
const endpoints = require("./utils/endpoints");
const configInit = require("./utils/config");
const fs = require('fs');
const path = require('path');

const api = axios.create();
const collections = collectionsInit();
const config = configInit();

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const getData = (url, apiName) => {
    return new Promise((resolve, reject) => {
        api.get(url, {
            headers: {
                "X-API-KEY": config[apiName].apikey
            }
        })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

// OpenSea
const getCollections = async (slug) => {
    let cdata;

    const url = endpoints("opensea", "collection", [slug], "");

    await getData(url, "opensea")
        .then(data => cdata = data.data)
        .catch(error => console.log(error));

    return cdata;
}

const getRandomOwner = async (address, totalSupply) => {
    let cdata;

    const tokenID = randomNumber(1, parseInt(totalSupply));

    const url = endpoints(
        "opensea",
        "asset",
        [address, tokenID.toString(), "owners"],
        {
            "limit": "1",
            "order_by": "created_date",
            "order_direction": "desc"
        }
    );

    await getData(url, "opensea")
        .then(data => cdata = data.data.owners[0].owner.address)
        .catch(error => console.log(error));

    return cdata;
}

const getEvents = async (cAddress, oAddress) => {
    let cdata;

    const url = endpoints(
        "opensea",
        "",
        ["events"],
        {
            "asset_contract_address": cAddress,
            "account_address": oAddress
        }
    );

    await getData(url, "opensea")
        .then(data => cdata = data.data.asset_events)
        .catch(error => console.log(error));

    return cdata;
}

// Etherscan
const getContracts = async (address) => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "contract",
            "action": "getsourcecode",
            "address": address,
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result)
        .catch(error => console.log(error));

    return cdata;
}

const getGas = async () => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "gastracker",
            "action": "gasoracle",
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result)
        .catch(error => console.log(error));

    return cdata;
}

const getBlockNo = async (timestamp) => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "block",
            "action": "getblocknobytime",
            "timestamp": timestamp,
            "closest": "before",
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result)
        .catch(error => console.log(error));

    return cdata;
}

const getBlockInfo = async (block) => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "block",
            "action": "getblockreward",
            "blockno": block,
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result)
        .catch(error => console.log(error));

    return cdata;
}

const getTransactions = async (address) => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "account",
            "action": "txlist",
            "address": address,
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result.length)
        .catch(error => console.log(error));

    return cdata;
}

const getTransactionData = async (address) => {
    let cdata;

    const url = endpoints(
        "etherscan",
        "",
        "",
        {
            "module": "account",
            "action": "txlist",
            "startblock": "0",
            "endblock": "99999999",
            "address": address,
            "apikey": config["etherscan"].apikey,
        }
    );

    await getData(url, "etherscan")
        .then(data => cdata = data.data.result)
        .catch(error => console.log(error));

    return cdata;
}

const updateCollectionData = async () => {
    console.clear();
    console.log("### Collections update ###\n");

    for (const i in collections) {
        let cdata = {};
        let block;

        cdata.static = {}
        cdata.dynamic = {}
        cdata.dynamic.owner = {}

        console.log("Collection " + (Number(i) + 1) + "/" + collections.length);
        console.log("Getting data for: " + collections[i].slug);
        await getCollections(collections[i].slug)
            .then(data => {
                cdata.static.address = collections[i].address;
                cdata.static.slug = collections[i].slug;
                cdata.static.name = data.collection.name;
                cdata.static.created_date = data.collection.created_date;
                cdata.static.token_type = data.collection.primary_asset_contracts[0].schema_name;
                cdata.static.symbol = data.collection.primary_asset_contracts[0].symbol;
                cdata.static.trait_count = Object.keys(data.collection.traits).length;
                cdata.static.traits = data.collection.traits;

                cdata.static.traits = data.collection.payout_address;

                cdata.stats = data.collection.stats;
            })
            .catch(error => console.log(error));

        await getContracts(collections[i].address)
            .then(data => {
                cdata.static.compiler_version = data[0].CompilerVersion;
                cdata.static.licence_type = data[0].LicenseType ? data[0].LicenseType : "None";
                cdata.static.contract_size = data[0].ABI.length;
            })
            .catch(error => console.log(error));

        await getGas()
            .then(data => {
                cdata.dynamic.gas = {
                    safe: data.SafeGasPrice,
                    porpose: data.ProposeGasPrice,
                    fast: data.FastGasPrice
                }
            })
            .catch(error => console.log(error));

        const date = new Date(cdata.static.created_date);
        const time = date.getTime();

        const timestamp = Math.floor(time / 1000);

        await getBlockNo(timestamp)
            .then(data => block = data)
            .catch(error => console.log(error));

        await getBlockInfo(block)
            .then(data => {
                cdata.dynamic.block = {
                    no: data.blockNumber,
                    miner: data.blockMiner,
                    reward: data.blockReward
                }
            })
            .catch(error => console.log(error));

        await getRandomOwner(collections[i].address, cdata.stats.total_supply)
            .then(data => {
                cdata.dynamic.owner.address = data;
            })
            .catch(error => console.log(error));

        let dataError = false;
        await getEvents(collections[i].address, cdata.dynamic.owner.address)
            .then(data => {

                if (data) {
                    cdata.dynamic.owner.transfers = data.filter(value => value.event_type === 'transfer').length;
                    cdata.dynamic.owner.sales = data.filter(value => value.event_type === 'successful').length;
                    cdata.dynamic.owner.offers = data.filter(value => value.event_type === 'offer_entered').length;
                } else {
                    dataError = true;
                }
            })
            .catch(error => {
                console.warn("Data error for: " + collections[i].slug)
                //console.log(error);
            });

        if (dataError) {
            console.warn("Data error for: " + collections[i].slug)
        } else {
            await getTransactions(cdata.dynamic.owner.address)
                .then(data => {
                    cdata.dynamic.owner.transactions = data;
                })
                .catch(error => console.log(error));

            await getTransactionData(collections[i].address)
                .then(data => {
                    let transactionData = [];
                    for (let j in data) {
                        transactionData.push({
                            blockNumber: Number(data[j].blockNumber),
                            timeStamp: Number(data[j].timeStamp) * 1000,
                            nonce: Number(data[j].nonce),
                            transactionIndex: Number(data[j].transactionIndex),
                            value: Number(data[j].value),
                            gas: Number(data[j].gas),
                            gasPrice: Number(data[j].gasPrice),
                            cumulativeGasUsed: Number(data[j].cumulativeGasUsed),
                            gasUsed: Number(data[j].gasUsed),
                            confirmations: Number(data[j].confirmations),
                        });
                    }
                    cdata.transactionData = transactionData;
                });


            const jsonData = JSON.stringify(cdata);

            // Json Export
            fs.writeFileSync(path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + ".json", jsonData, function (err, result) {
                if (err) console.log('error', err);
            });

            console.log("Data retrieved for: " + collections[i].slug + "\n\n")
        }
    }
}

updateCollectionData().then(() => console.log("\n\n### All collection data updated ###\n"));
