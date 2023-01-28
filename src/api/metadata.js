const fs = require('fs');
const Randomize = require('../art/config/randomize');
const {Random} = require('../art/tools/random');
const collectionsInit = require("../data/utils/collections");
const data = require('../art/config/config');
const sketches = require('../art/config/sketches');

const apiUrl = "https://artifact-api-5tgi2.ondigitalocean.app/" // Must be "/" at the end
const titlePrefix = "Artifact Nft"
const description = "Description about the Artifact Nft"
const external_url = "external_url"

exports.createMetadata = async function (hash, sketchid, tokenid) {

    const jsonPrototype = fs.readFileSync("./src/api/prototype.json", 'utf8');
    let jsonData = JSON.parse(jsonPrototype);
    const config = data;
    config.hash = hash;
    config.sketches = sketches;
    config.sketchId = sketchid;
    config.randomFunc = new Random(hash);

    /** Collections */
    const collections = collectionsInit();
    const collectionId = config.randomFunc.r_int(0, Object.keys(collections).length - 1);
    config.collection = collections[collectionId];

    async function getData() {
        const pathData = "./data/" + config.collection.slug + ".json";
        const pathTrns = "./data/" + config.collection.slug + "-transactions.json";

        let getData = fs.readFileSync(pathData);
        config.collectionData = JSON.parse(getData);
        if (config.sketches[config.sketchId.toString()].type === "Dynamic") {
            getData = fs.readFileSync(pathTrns);
            config.transactions = JSON.parse(getData);
        }
    }

    await getData()
        .then(function () {
            const vars = Randomize(config);

            jsonData.name = titlePrefix + " #" + pad(tokenid.toString(), 4);
            jsonData.description = description;
            jsonData.external_url = external_url;
            jsonData.hash = hash.toString();
            jsonData.image = apiUrl + "image/thumbnail/" + sketchid + "/" + hash + ".png";
            jsonData.animation_url = apiUrl + "generate/" + sketchid + "/" + hash;
            jsonData.background_color = vars.color_bg.replace("#", '');
            jsonData.attributes = [];

            for (let val, i = 0; i < Object.keys(config.meta).length; i++) {
                val = vars.meta[i];
                jsonData.attributes.push({
                    "trait_type": config.meta[i].title,
                    "value": val
                });
            }
        });

    return jsonData;
}

function pad(str, max) {
    return str.length < max ? pad("0" + str, max) : str;
}
