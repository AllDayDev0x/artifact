// browser simulation
const Window = require('window');
const {Blob} = require('./src/art/tools/blob.js');
global.window = new Window();
global.window.Blob = Blob;
global.document = global.window.document;
global.screen = global.window.screen;
global.navigator = global.window.navigator;

// imports
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rimraf = require('rimraf');
const express = require('express');
const getHash = require("./src/api/tools.js");
const {createMetadata} = require("./src/api/metadata");

const {render1} = require("./src/api/render-1.js");
const {render2} = require("./src/api/render-2.js");
const {render3} = require("./src/api/render-3.js");
const {render4} = require("./src/api/render-4.js");
const {render5} = require("./src/api/render-5.js");
const {render6} = require("./src/api/render-6.js");
const {render7} = require("./src/api/render-7.js");
const {render8} = require("./src/api/render-8.js");
const {render9} = require("./src/api/render-9.js");

// App start
const app = express();

// Enable All CORS Requests
app.use(cors())


// Whitelist for CORS Requests
const whitelist = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://domain',
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// Get hashes
// app.get('/hash/:amount', async (req, res) => {
//     let amount = Number(req.params.amount);
//     if (amount > 0 && amount <= 100) {
//         try {
//             const hashes = getHash(amount);
//             res.set({
//                 'Content-Type': 'application/json'
//             })
//             res.end(JSON.stringify(hashes));
//         } catch (error) {
//             res.status(500).send(error);
//         }
//     } else {
//         res.status(400).send('Amount is not correct.')
//     }
// });

// // Get Random Sketch
// app.get('/random/:sketchid', async (req, res) => {
//     const sketchid = req.params.sketchid;
//     if (sketchid > 0 && sketchid < 10) {
//         const filePath = path.resolve("./lib/prototype.html");
//         const p5Script = fs.readFileSync('./dist/browse-' + sketchid + '.js');
//         const sketchScript = fs.readFileSync('./dist/p5.min.js');
//         const prototype = fs.readFileSync('./src/api/prototype.html', 'utf8');
//         let html = prototype.replaceAll("hashhere", "");
//         html = html.replaceAll("scripthere", p5Script + sketchScript);
//         try {
//             res.type('.html');
//             res.set({'Content-Type': 'text/html'});
//             res.set('Cache-control', 'public, max-age=300');
//             res.send(html);
//             res.end();
//         } catch (error) {
//             res.status(500).send(error);
//         }
//     } else {
//         res.status(400).send('Bad request!')
//     }

// });

// // Get HTML
// app.get('/generate/:sketchid/:hash', async (req, res) => {

//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, User-Agent, X-Requested-With');
//     res.setHeader('Access-Control-Expose-Headers', "Content-Range, X-Chunked-Output, X-Stream-Output");

//     let hash = req.params.hash;
//     const sketchid = req.params.sketchid;
//     if (hash.length === 66 && sketchid > 0 && sketchid < 10) {
//         try {
//             const filePath = path.resolve("./temp/generate/" + hash + ".html");
//             if (!fs.existsSync(filePath)) {
//                 const p5Script = fs.readFileSync('./dist/browse-' + sketchid + '.js');
//                 const sketchScript = fs.readFileSync('./dist/p5.min.js');
//                 const prototype = fs.readFileSync('./src/api/prototype.html', 'utf8');
//                 let html = prototype.replaceAll("hashhere", hash);
//                 html = html.replaceAll("scripthere", p5Script + sketchScript);
//                 fs.writeFileSync(filePath, html);
//             }
//             if (fs.existsSync(filePath)) {
//                 res.type('.html');
//                 res.set({'Content-Type': 'text/html'});
//                 res.set('Cache-control', 'public, max-age=300');
//                 fs.readFile(filePath,
//                     {encoding: 'utf-8'},
//                     (error, fileContent) => {
//                         if (error) {
//                             res.status(500).send(error);
//                         } else {
//                             res.send(fileContent);
//                             res.end();
//                         }
//                     });
//             } else {
//                 res.status(404).send('File Not found')
//             }
//         } catch (error) {
//             console.log(error);
//             res.status(500).send(error);
//         }
//     } else {
//         res.status(400).send('Bad request!')
//     }
// });

// Meta Data
// app.get('/metadata/:tokenid/:sketchid/:hash', async (req, res) => {
//     const tokenid = req.params.tokenid;
//     const sketchid = req.params.sketchid;
//     let hash = req.params.hash;
//     if (hash.length === 66 && sketchid > 0 && sketchid < 10 && tokenid > 0) {
//         const json = await createMetadata(hash, sketchid, tokenid);
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify(json));
//     } else {
//         res.status(400).send('Bad request!')
//     }
// });

// Get Thumbnail Images
// app.get('/image/:type/:sketchid/:hash\.png', async (req, res) => {
//     let filePath = null;
//     const hash = req.params.hash;
//     const sketchid = req.params.sketchid;
//     const imageType = req.params.type;

//     if (hash.length === 66 && (imageType === "thumbnail" || imageType === "high-res")) {
//         try {
//             switch (Number(sketchid)) {
//                 case 1:
//                     filePath = await render1(hash, imageType);
//                     break;
//                 case 2:
//                     filePath = await render2(hash, imageType);
//                     break;
//                 case 3:
//                     filePath = await render3(hash, imageType);
//                     break;
//                 case 4:
//                     filePath = await render4(hash, imageType);
//                     break;
//                 case 5:
//                     filePath = await render5(hash, imageType);
//                     break;
//                 case 6:
//                     filePath = await render6(hash, imageType);
//                     break;
//                 case 7:
//                     filePath = await render7(hash, imageType);
//                     break;
//                 case 8:
//                     filePath = await render8(hash, imageType);
//                     break;
//                 case 9:
//                     filePath = await render9(hash, imageType);
//                     break;
//             }
//         } catch (error) {
//             console.log(error);
//             return res.status(500).send(error);
//         }
//         if (filePath) {
//             try {
//                 res.type('.png');
//                 res.set({'Content-Type': 'image/png'});
//                 res.set('Cache-control', 'public, max-age=300');
//                 fs.readFile(filePath,
//                     {},
//                     (error, fileContent) => {
//                         if (error) {
//                             res.status(500).send(error);
//                         } else {
//                             res.send(fileContent);
//                             res.end();
//                         }
//                     });
//             } catch (error) {
//                 res.status(500).send(error);
//             }
//         } else {
//             return res.status(404).send("Not Found!");
//         }
//     } else {
//         return res.status(400).send('Bad request!')
//     }
// });
// Reset
// app.get('/reset-all-generated-files', async (req, res) => {
//     rimraf.sync('./temp/generate/!*.html');
//     rimraf.sync('./temp/thumbnail/!*.png');
//     rimraf.sync('./temp/high-res/!*.png');
//     res.status(400).send('!')
// });
app.get("/", async (req, res) => {
    res.send("ok")
})
// Json Data
// app.get('/data/:jsonPath', async (req, res) => {
//     let jsonPath = req.params.jsonPath;

//     if (jsonPath.length) {
//         let filePath = "./data/" + jsonPath;
//         if (fs.existsSync(filePath)) {
//             res.type('.json');
//             res.set({'Content-Type': 'application/json'});
//             res.set('Cache-control', 'public, max-age=300');
//             fs.readFile(filePath,
//                 {encoding: 'utf-8'},
//                 (error, fileContent) => {
//                     if (error) {
//                         res.status(500).send(error);
//                     } else {
//                         res.send(fileContent);
//                         res.end();
//                     }
//                 });
//         } else {
//             res.status(404).send('File Not found')
//         }
//     } else {
//         res.status(400).send('Bad request!')
//     }
// });

// // favicon 204 No content
// app.get('/favicon.ico', (req, res) => res.status(204).send('No content'));

// Server Start
app.listen(3000, () => console.log(`Artifact NFT App listening on port 3000!`));
module.exports = app;