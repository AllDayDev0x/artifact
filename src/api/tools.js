module.exports = function (amount) {
    const hashes = {};
    for (let i = 0; i < amount; i++) {
        hashes[(i + 1).toString()] = genRandomHash();
    }
    return hashes;
}

function genRandomHash() {
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    return hash;
}
