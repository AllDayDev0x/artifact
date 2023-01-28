const fs = require('fs'),
    request = require('request');

exports.download = async function (uri, filename) {

    const getFile = new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            //console.log('content-type:', res.headers['content-type']);
            //console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename))
                .on('close', function () {
                    resolve(true);
                })
                .on('error', function () {
                    reject(false);
                });
            if (err) {
                reject(false);
            }
        });
    });

    return await getFile;
};

//download('https://www.google.com/images/srpr/logo3w.png', 'google.png');


exports.hexToRgb = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

exports.getLuminance = function (hex) {
    const rgb = exports.hexToRgb(hex);
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
}