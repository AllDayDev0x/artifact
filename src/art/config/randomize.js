const {psbc} = require('../tools/psbc.js');

module.exports = function (config) {

    let vars = {};
    vars.hash = config.hash;
    vars.randomFunc = config.randomFunc;
    vars.gWidth = config.gWidth;
    vars.gHeight = config.gHeight;
    vars.backend = config.backend;

    vars.debug = config.debug;
    vars.imgSaveMode = config.imgSaveMode;
    vars.onStart = config.onStart;
    vars.onFinish = config.onFinish;
    vars.currentScale = config.currentScale;
    vars.highResScale = config.highResScale;
    vars.dataUsageScale = vars.randomFunc.r_num(.5, 1);

    vars.meta = {
        0: null, // Composition
        1: null, // NFT Collection
        2: null, // Data Usage
        3: null, // Type
        4: null // Interactive
    };

    /** Get Sketch Func */
    vars.sketches = config.sketches;
    if (config.hasOwnProperty('sketchId')) {
        vars.sketchId = config.sketchId;
    } else {
        vars.sketchId = vars.randomFunc.r_int(1, Object.keys(vars.sketches).length);
    }
    vars.sketch = vars.sketches[vars.sketchId];
    vars.meta[0] = vars.sketch.title;
    vars.meta[1] = config.collection.name;
    vars.meta[2] = vars.dataUsageScale > .85 ? "Max" : (vars.dataUsageScale > .65 ? "Mid" : "Low");
    vars.meta[3] = vars.sketch.type;
    vars.meta[4] = vars.sketch.interactive ? "Yes" : "No";

    vars.collectionData = config.collectionData;
    if (vars.sketch.type === "Dynamic" && config.transactions) {
        vars.transactions = config.transactions;
        vars.dataStartIndex = vars.randomFunc.r_int(0, Object.keys(vars.transactions).length - 1);
        vars.dataMax = vars.randomFunc.r_int(150, 450);
    } else {
        delete vars.collectionData.transactionMin;
        delete vars.collectionData.transactionMax;
    }

    /** Collection Colors */
    const colorsCount = Object.keys(vars.collectionData.allColors).length;
    const tmpColorList = [];
    for (let hex in vars.collectionData.allColors) {
        tmpColorList.push(hex);
    }

    const colorStartIndex = vars.randomFunc.r_int(0, colorsCount - 1);

    vars.colors = [];
    for (let i = colorStartIndex; i < colorStartIndex + 20; i++) {
        vars.colors.push(tmpColorList[i % colorsCount]);
    }
    delete vars.collectionData.allColors;

    /** Default Colors */
    vars.color_main = vars.randomFunc.r_ar(vars.colors);
    vars.color_bg = psbc(-0.992, vars.color_main);
    vars.color_fr = psbc(0.6, vars.color_main);

    /** Move stats to dynamic */
    let keys = Object.keys(vars.collectionData.stats);
    for (let i in keys) {
        vars.collectionData.dynamic[keys[i]] = vars.collectionData.stats[keys[i]];
    }
    delete vars.collectionData.stats;
    delete config.transactions;

    return vars;
}
