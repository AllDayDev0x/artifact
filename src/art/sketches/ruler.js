module.exports = function frameRuler(_p, textOn, diff) {
    _p.noFill();
    _p.push();
    _p.translate(-_p.width / 2, -_p.height / 2);
    _p.stroke("#ffffff");
    _p.strokeWeight(1);

    let stepsH = 40;
    let step = _p.height / stepsH;
    let stepsW = Math.floor(_p.width / step);
    let leftX = step * 2;
    let leftY = step * 2;
    let lineHeight = step / 2;

    // Top & Bottom
    let halfSize;
    for (let i = 2; i < stepsW - 1; i++) {
        leftX = (step) * i;
        halfSize = (i % 2 === 0 ? lineHeight : (lineHeight / 2));
        _p.line(leftX, leftY, leftX, leftY - halfSize);
        _p.line(leftX, _p.height - leftY, leftX, _p.height - leftY + halfSize);
    }
    // Right & Left
    leftX = step * 2;
    leftY = step * 2;
    for (let i = 2; i < stepsH - 1; i++) {
        leftY = (step) * i;
        halfSize = (i % 2 === 0 ? lineHeight : (lineHeight / 2));
        _p.line(leftX, leftY, leftX - halfSize, leftY);
        _p.line(_p.width - leftX, leftY, _p.width - leftX + halfSize, leftY);
    }
    _p.pop()
}


/*
    if (textOn) {
        _p.textSize(18);
        _p.textFont('Georgia');
    }
    if (textOn) {
        _p.noStroke()
        _p.fill("#ffffff");
        _p.text(counter, x + diff, padHalf - 20 + diff)
        _p.text(counter, padHalf - 20 + diff, x + diff)
    }
*/
