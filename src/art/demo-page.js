const Randomize = require('./config/randomize');
const {demo} = require('./tools/demo');
const {Random} = require('./tools/random');
const collectionsInit = require("./../data/utils/collections");
const data = require('./config/config');
const sketches = require('./config/sketches');

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
let getHash = document.querySelector('meta[name="hash"]').content;
if (getHash.length !== 66) {
    getHash = params.hash || undefined;
} else {
    getHash = params.hash || undefined;
}

/** Get Main Config */
const mainConfig = getConfig(getHash);

/** Debug */
if (mainConfig.debug) {
    console.log("Hash:");
    console.log(mainConfig.hash);
}

let sketchId = params.sketchId || 1;

if (sketchId) {
    if (Number(sketchId < 1) || Number(sketchId > 9)) {
        sketchId = 1;
    }
    mainConfig.sketchId = sketchId;
}

/** Rand Func */
mainConfig.randomFunc = new Random(mainConfig.hash);

/** Collections */
const collections = collectionsInit();
const collectionId = mainConfig.randomFunc.r_int(0, Object.keys(collections).length - 1);
mainConfig.collection = collections[collectionId];

async function getData() {
    await fetch("/data/" + mainConfig.collection.slug + ".json")
        .then(response => response.json())
        .then(json => mainConfig.collectionData = json);

    if (mainConfig.sketches[mainConfig.sketchId].type === "Dynamic") {
        await fetch("/data/" + mainConfig.collection.slug + "-transactions.json")
            .then(response => response.json())
            .then(json => mainConfig.transactions = json);
    }

    /** For Demo */
    await fetch("/data/downloaded/" + mainConfig.collection.slug + ".json")
        .then(response => response.json())
        .then(json => mainConfig.demoData = json);
}

getData()
    .then(function () {
        /** Get Main Vars */
        const vars = Randomize(mainConfig);

        /** Demo works */
        vars.demoData = mainConfig.demoData;
        demo(vars);
    });
