const Randomize = require('../config/randomize');
const {Random} = require('../tools/random');
const collectionsInit = require("../../data/utils/collections");
const data = require('../config/config');
const sketches = require('../config/sketches');

const p5 = require('p5');

module.exports = async function (sketchId) {

    const genRandomHash = function () {
        let hash = "0x";
        for (let i = 0; i < 64; i++) {
            hash += Math.floor(Math.random() * 16).toString(16);
        }
        return hash;
    }

    const getConfig = function (hash) {
        data.hash = hash || genRandomHash();
        data.sketches = sketches;
        return data;
    }

    /** Query Strings */
    let mainConfig;
    let getHash = document.querySelector('meta[name="hash"]');
    const qs = document.location.search.replaceAll("?", "");
    let qsAr = qs.split("&");
    let rowAr, params = {
        hash: null
    };
    for (let i = 0; i < qsAr.length; i++) {
        rowAr = qsAr[i].split("=");
        params[rowAr[0]] = rowAr[1];
    }

    /** Meta Hash*/
    if (getHash) {
        getHash = getHash.content;
        if (getHash.length !== 66) {
            getHash = params.hash || undefined;
        } else {
            getHash = params.hash || undefined;
        }
    }

    /** Get Main Config */
    mainConfig = getConfig(getHash);

    /** Debug */
    if (mainConfig.debug) {
        console.log("Hash:");
        console.log(mainConfig.hash);
    }

    mainConfig.sketchId = sketchId;

    /** Rand Func */
    mainConfig.randomFunc = new Random(mainConfig.hash);

    /** Collections */
    const collections = collectionsInit();
    const collectionId = mainConfig.randomFunc.r_int(0, Object.keys(collections).length - 1);
    mainConfig.collection = collections[collectionId];

    async function getData() {
        const pathData = "/data/" + mainConfig.collection.slug + ".json";
        const pathTrns = "/data/" + mainConfig.collection.slug + "-transactions.json";
        await fetch(pathData)
            .then(response => response.json())
            .then(json => mainConfig.collectionData = json);
        if (mainConfig.sketches[mainConfig.sketchId].type === "Dynamic") {
            await fetch(pathTrns)
                .then(response => response.json())
                .then(json => mainConfig.transactions = json);
        }
    }

    const sizeInitialize = function (_p5) {
        const DEFAULT_WIDTH = mainConfig.gWidth;
        const DEFAULT_HEIGHT = mainConfig.gHeight;
        let WIDTH = _p5.windowWidth;
        let HEIGHT = _p5.windowHeight;
        const ACPECT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT < WIDTH / HEIGHT ? HEIGHT / DEFAULT_HEIGHT : WIDTH / DEFAULT_WIDTH;
        WIDTH = DEFAULT_WIDTH * ACPECT_RATIO;
        HEIGHT = DEFAULT_HEIGHT * ACPECT_RATIO;
        return [WIDTH, HEIGHT, ACPECT_RATIO, DEFAULT_WIDTH, DEFAULT_HEIGHT];
    }

    return await getData()
        .then(function () {
            const vars = Randomize(mainConfig);
            //console.log(vars.meta);
            return [p5, vars, mainConfig.randomFunc, sizeInitialize];
        });


}
