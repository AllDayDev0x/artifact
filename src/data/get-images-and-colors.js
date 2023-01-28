const axios = require("axios").default;
const collectionsInit = require("./utils/collections")
const endpoints = require("./utils/endpoints");
const configInit = require("./utils/config");
const fs = require('fs');
const {download, getLuminance} = require("./utils/tools");
const path = require("path");
const rimraf = require("rimraf");
const getColors = require('get-image-colors')

const api = axios.create();
const collections = collectionsInit();
const config = configInit();
let commonError = false;


const getData = (url, apiName) => {
    return new Promise((resolve, reject) => {
        api.get(url, {
            headers: {
                "X-API-KEY": config[apiName].apikey
            }
        })
            .then(data => resolve(data))
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

// OpenSea
const getAsset = async (slug, tokenId) => {
    let cdata;

    const url = endpoints("opensea", "asset", [slug, tokenId], "");

    await getData(url, "opensea")
        .then(data => cdata = data.data)
        .catch(error => {
            console.log(error);
        });

    return cdata;
}

const checkAndDownload = async () => {

    console.clear();
    console.log("### Downloading collection images ###\n");

    let colorsExist, collectionPath, colorFile;
    for (let i in collections) {
        commonError = false;
        colorsExist = false;
        collectionPath = path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + ".json";
        colorFile = path.dirname(__filename) + "./../../data/downloaded/" + collections[i].slug + '-colors.json';

        if (fs.existsSync(collectionPath)) {
            console.log("Collection " + (Number(i) + 1) + "/" + collections.length);
            console.log("Getting images for: " + collections[i].slug);

            if (fs.existsSync(colorFile)) {
                let colorData = fs.readFileSync(colorFile);
                colorData = JSON.parse(colorData);
                colorsExist = Object.keys(colorData).length >= 10;
            }

            if (colorsExist) {
                console.log("Color file is already exist.\n\n");
            } else {
                let collectionData = fs.readFileSync(collectionPath),
                    imagePath,
                    isDownloaded;
                collectionData = JSON.parse(collectionData);
                let allColors = [],
                    colorData = {},
                    hexCodes, hex,
                    json, luma;

                let total_supply = collectionData.stats.total_supply,
                    startId = 1;

                total_supply = 101;

                for (let tokenID = startId; tokenID < total_supply; tokenID++) {
                    process.stdout.write("->Downloading image's token id: " + tokenID.toString() + " / " + (total_supply - 1).toString() + "\r");
                    await getAsset(collections[i].address, tokenID)
                        .then(async data => {
                            imagePath = path.join(path.dirname(__filename) + "./../../temp/color-images/", collections[i].slug + tokenID + ".png");
                            isDownloaded = await download(data.image_preview_url, imagePath);
                            if (isDownloaded) {

                                // Read colors
                                getColors(imagePath, {
                                    count: 10,
                                    type: 'image/png'
                                }).then(colors => {
                                    hexCodes = colors.map(color => color.hex());
                                    for (let i in hexCodes) {
                                        hex = hexCodes[i];
                                        luma = getLuminance(hex);
                                        if (luma > .3 && luma < .8) {
                                            if (allColors.includes(hex)) {
                                                colorData[hex]++;
                                            } else {
                                                allColors.push(hex);
                                                colorData[hex] = 1;
                                            }
                                        }
                                    }
                                });
                            }
                        }).catch(error => {
                            commonError = true;
                            console.log(error);
                        });
                }
                if (commonError) {
                    console.log("\t\tERROR for: ->" + collections[i].slug + "\n\n");
                } else {
                    let newList = [];
                    for (let hex in colorData) {
                        newList.push({hex: hex, count: colorData[hex]})
                    }
                    newList.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
                    colorData = {};
                    for (let i in newList) {
                        colorData[newList[i].hex] = newList[i].count;
                    }

                    // Write colors to Json file
                    json = JSON.stringify(colorData);
                    fs.writeFileSync(colorFile, json);

                }
                // Delete All Images
                rimraf.sync(path.dirname(__filename) + "./../../temp/color-images/*");
                console.log(" ");
                console.log("Created Color file for: " + collections[i].slug + "\n\n");
            }

        }
    }
}

checkAndDownload().then(() => console.log("\n\n### All color data updated ###\n"));
