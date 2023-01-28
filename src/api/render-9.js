const sketchId = 9;
const sketch = require('../art/sketches/shape' + sketchId + '.js');

const fs = require('fs');
const p5 = require('p5');
const Randomize = require('../art/config/randomize');
const {Random} = require('../art/tools/random');
const collectionsInit = require("../data/utils/collections");
const data = require('../art/config/config');
const sketches = require('../art/config/sketches');

exports.render9 = async function (hash, imageType) {
    /*
    const genRandomHash = function () {
        let hash = "0x";
        for (let i = 0; i < 64; i++) {
            hash += Math.floor(Math.random() * 16).toString(16);
        }
        return hash;
    }
    data.hash = process.argv[2] ? String(process.argv[2]) : genRandomHash();
    */
    data.hash = hash;
    data.backend = true;

    let fileName, returnPath;
    fileName = data.hash.toString() + '.png';
    returnPath = './temp/' + imageType + '/' + fileName;

    if (fs.existsSync(returnPath)) {
        return returnPath;
    } else {

        return new Promise((resolve, reject) => {


            /** Query Strings */
            let mainConfig = data;


            /** Debug */
            if (mainConfig.debug) {
                console.log("Hash:");
                console.log(mainConfig.hash);
            }

            mainConfig.sketchId = sketchId;
            data.sketches = sketches;

            /** Rand Func */
            mainConfig.randomFunc = new Random(mainConfig.hash);

            /** Collections */
            const collections = collectionsInit();
            const collectionId = mainConfig.randomFunc.r_int(0, Object.keys(collections).length - 1);
            mainConfig.collection = collections[collectionId];


            async function getData() {
                const pathData = "./data/" + mainConfig.collection.slug + ".json";
                const pathTrns = "./data/" + mainConfig.collection.slug + "-transactions.json";

                let getData = fs.readFileSync(pathData);
                mainConfig.collectionData = JSON.parse(getData);
                if (mainConfig.sketches[mainConfig.sketchId.toString()].type === "Dynamic") {
                    getData = fs.readFileSync(pathTrns);
                    mainConfig.transactions = JSON.parse(getData);
                }
            }


            mainConfig.onFinish = async function (canvas) {
                canvas.elt.toBlob(
                    async data => {
                        let writeStream = fs.createWriteStream(returnPath)
                        await writeStream.on('finish', () => {
                            // console.log('file size: ' + data.size);
                            console.log("Render completed: " + returnPath);
                            resolve(returnPath);
                        });
                        writeStream.on('error', (err) => {
                            console.error(err);
                            reject(err)
                        });
                        writeStream.write(data.arrayBuffer());
                        writeStream.end();
                    },
                    'image/png'
                );
            };

            getData()
                .then(function () {
                    /** Start */
                    new p5(function (p) {
                        let vars = Randomize(mainConfig);
                        if (imageType === "high-res") {
                            vars.currentScale = vars.highResScale;
                        }
                        return sketch(p, vars);
                    });
                });
        });
    }
}