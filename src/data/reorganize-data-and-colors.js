const fs = require('fs');
const path = require("path");
const BigNumber = require('bignumber.js');
const collectionsInit = require("./utils/collections")
const collections = collectionsInit();

const valToNumber = (value) => {
    let returnValue;
    value = value ? value.toString() : "";
    // check if the value is an address
    if (value.startsWith("0x")) {
        returnValue = (new BigNumber(value)).toNumber() / 1e+40
    }
    // check if the value is a date
    else if (value.includes('T') && value.includes(':') && value.includes('+')) {
        returnValue = new Date(value).getTime();
    }
    // probably a number
    else {
        returnValue = Number(value);
    }

    if (isNaN(returnValue) || returnValue === Infinity || returnValue === undefined) {
        returnValue = 0;
    }

    return returnValue;
}

const getVals = () => {
    return {
        static: {
            address: NaN,
            date: NaN,
            trait: NaN,
            size: NaN,
            supply: NaN,
        },
        stats: {
            one_hour_volume: NaN,
            six_hour_volume: NaN,
            one_day_volume: NaN,
            seven_day_volume: NaN,
            thirty_day_volume: NaN,
            total_sales: NaN,
            num_owners: NaN,
            average_price: NaN,
            market_cap: NaN,
        },
        dynamic: {
            ownerAddress: NaN,
            ownerTransfers: NaN,
            ownerTransactions: NaN,
            gasSafe: NaN,
            gasPorpose: NaN,
            gasFast: NaN,
            blockNo: NaN,
            blockMiner: NaN,
            blockReward: NaN,
        }
    }
}
let colVals,
    minVals = getVals(),
    maxVals = getVals();

const reOrganize = async () => {

    console.clear();
    console.log("### Re-organizing collection data and colors ###\n");

    let collectionFilePath, collectionComputedFilePath, colorFilePath,
        collectionData, allColors,
        json, bigNumber,
        computedCollectionData = {};
    const mainKeys = ["static", "stats", "dynamic"];
    const compiledExportFolderPath = path.dirname(__filename) + "./../../data/";

    /** Compute the collection data  */
    for (let i in collections) {
        collectionFilePath = path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + ".json";
        collectionComputedFilePath = path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + "-computed.json";

        if (fs.existsSync(collectionFilePath)) {
            colVals = getVals();
            colVals.transactionMin = {
                blockNumber: NaN,
                timeStamp: NaN,
                nonce: NaN,
                transactionIndex: NaN,
                value: NaN,
                gas: NaN,
                gasPrice: NaN,
                cumulativeGasUsed: NaN,
                gasUsed: NaN,
                confirmations: NaN
            };
            colVals.transactionMax = {
                blockNumber: NaN,
                timeStamp: NaN,
                nonce: NaN,
                transactionIndex: NaN,
                value: NaN,
                gas: NaN,
                gasPrice: NaN,
                cumulativeGasUsed: NaN,
                gasUsed: NaN,
                confirmations: NaN
            };
            //console.log("Computing data for: " + collections[i].slug + " " + (Number(i) + 1) + "/" + collections.length);
            process.stdout.write("-> "+(Number(i) + 1) + "/" + collections.length + " Computing data for: " + collections[i].slug + "                                            \r");

            if (fs.existsSync(collectionFilePath)/* && fs.existsSync(colorFilePath)*/) {
                collectionData = fs.readFileSync(collectionFilePath);
                collectionData = JSON.parse(collectionData);

                colVals.static.address = valToNumber(collectionData.static.address);
                colVals.static.date = valToNumber(collectionData.static.created_date);
                colVals.static.trait = valToNumber(collectionData.static.trait_count);
                colVals.static.size = valToNumber(collectionData.static.contract_size);
                colVals.static.supply = valToNumber(collectionData.stats.total_supply);

                colVals.stats.one_hour_volume = valToNumber(collectionData.stats.one_hour_volume);
                colVals.stats.six_hour_volume = valToNumber(collectionData.stats.six_hour_volume);
                colVals.stats.one_day_volume = valToNumber(collectionData.stats.one_day_volume);
                colVals.stats.seven_day_volume = valToNumber(collectionData.stats.seven_day_volume);
                colVals.stats.thirty_day_volume = valToNumber(collectionData.stats.thirty_day_volume);
                colVals.stats.total_sales = valToNumber(collectionData.stats.total_sales);
                colVals.stats.num_owners = valToNumber(collectionData.stats.num_owners);
                colVals.stats.average_price = valToNumber(collectionData.stats.average_price);
                colVals.stats.market_cap = valToNumber(collectionData.stats.market_cap);

                colVals.dynamic.ownerAddress = valToNumber(collectionData.dynamic.owner.address);
                colVals.dynamic.ownerTransfers = valToNumber(collectionData.dynamic.owner.transfers);
                colVals.dynamic.ownerTransactions = valToNumber(collectionData.dynamic.owner.transactions);
                colVals.dynamic.gasSafe = valToNumber(collectionData.dynamic.gas.safe);
                colVals.dynamic.gasPorpose = valToNumber(collectionData.dynamic.gas.porpose);
                colVals.dynamic.gasFast = valToNumber(collectionData.dynamic.gas.fast);
                colVals.dynamic.blockNo = valToNumber(collectionData.dynamic.block.no);
                colVals.dynamic.blockMiner = valToNumber(collectionData.dynamic.block.miner);
                colVals.dynamic.blockReward = valToNumber(collectionData.dynamic.block.reward);

                /** Calculate Averages */
                let mainKey;

                for (let j in mainKeys) {
                    mainKey = mainKeys[j];
                    let key, keys = Object.keys(colVals[mainKey]);
                    for (let i in keys) {
                        key = keys[i];
                        if (isNaN(minVals[mainKey][key]) || minVals[mainKey][key] > colVals[mainKey][key]) {
                            minVals[mainKey][key] = colVals[mainKey][key];
                        }
                        if (isNaN(maxVals[mainKey][key]) || maxVals[mainKey][key] < colVals[mainKey][key]) {
                            maxVals[mainKey][key] = colVals[mainKey][key];
                        }
                    }
                }

                /** Transaction Data Min Max values calc */
                if (Object.keys(collectionData.transactionData).length > 0) {
                    for (let keys, key, val, row, j = 0; j < Object.keys(collectionData.transactionData).length; j++) {
                        row = collectionData.transactionData[j];
                        keys = Object.keys(row);
                        for (let i in keys) {
                            key = keys[i];
                            val = valToNumber(row[key]);
                            if (isNaN(colVals.transactionMin[key]) || colVals.transactionMin[key] > val) {
                                colVals.transactionMin[key] = val;
                            }
                            if (isNaN(colVals.transactionMax[key]) || colVals.transactionMax[key] < val) {
                                colVals.transactionMax[key] = val;
                            }
                        }
                    }
                } else {
                    let keys = Object.keys(colVals.transactionMin);
                    for (let i in keys) {
                        colVals.transactionMin[keys[i]] = 0;
                        colVals.transactionMax[keys[i]] = 0;
                    }
                }

                computedCollectionData[collections[i].slug] = colVals;

                // Write computed data to Json file
                json = JSON.stringify(colVals);
                fs.writeFileSync(collectionComputedFilePath, json);

                // Write transaction data to Json file
                json = JSON.stringify(collectionData.transactionData);
                fs.writeFileSync(compiledExportFolderPath + collections[i].slug + '-transactions.json', json);

            } else {
                console.error("Data and/or color files are not exist!\n\n");
            }
        }
    }
    process.stdout.write("All collections computed.                                                                \r");

    /** Convert computed data to scales */
    console.log("\n\n### Saving the scales ###\n")
    let exportCollectionData, row, slug;
    const keys = Object.keys(computedCollectionData);
    for (let i in keys) {
        process.stdout.write("->Converting computed data " + (Number(i) + 1).toString() + " / " + (keys.length).toString() + "\r");

        slug = keys[i];
        row = computedCollectionData[slug];

        let mainKey;
        exportCollectionData = {};
        for (let j in mainKeys) {
            mainKey = mainKeys[j];
            let key, keys = Object.keys(minVals[mainKey]);
            exportCollectionData[mainKey] = {};
            for (let i in keys) {
                key = keys[i];
                exportCollectionData[mainKey][key] = Number(valToNumber(row[mainKey][key] / ((minVals[mainKey][key] + maxVals[mainKey][key]) / 2)).toFixed(4));
                //console.log("Min: " + minVals[mainKey][key] + ", Max: " + maxVals[mainKey][key] + ", Value: " + row[mainKey][key] + " Result: " + exportCollectionData[mainKey][key]);
            }
        }
        exportCollectionData.transactionMin = row.transactionMin;
        exportCollectionData.transactionMax = row.transactionMax;

        /** Colors */
        colorFilePath = path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + '-colors.json';
        allColors = fs.readFileSync(colorFilePath);
        exportCollectionData.allColors = JSON.parse(allColors);

        // Write computed data to Json file
        json = JSON.stringify(exportCollectionData);
        fs.writeFileSync(compiledExportFolderPath + collections[i].slug + '.json', json);
    }
    process.stdout.write("Done!                                                                                    \r");
}

reOrganize().then(() => console.log("\n\n\n### All data and colors re-organized ###\n"));
