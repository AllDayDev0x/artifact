module.exports = {
    debug: true,
    backend: false,
    gl: null,
    gWidth: 600,
    gHeight: 800,
    currentScale: 1,
    highResScale: 2.5,
    imgSaveMode: false,
    hash: null,
    onStart: function (/* canvas, hash */) {
        //console.log("Started.");
    },
    onFinish: function (/* canvas, hash */) {
        //console.log("Completed.");
    },
    meta: {
        0: {title: "Composition", vals: ""},
        1: {title: "NFT Collection", val: ""},
        2: {title: "Data Usage", val: ""},
        3: {title: "Type", val: ""},
        4: {title: "Interactive", val: ""},
    },
}