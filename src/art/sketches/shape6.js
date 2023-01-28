const frameRuler = require("./ruler");
module.exports = async function (_p5, vars) {

    const R = vars.randomFunc;
    let DEFAULT_WIDTH = vars.gWidth;
    let DEFAULT_HEIGHT = vars.gHeight;
    let WIDTH = vars.backend ? (DEFAULT_WIDTH * vars.currentScale) : _p5.windowWidth;
    let HEIGHT = vars.backend ? (DEFAULT_HEIGHT * vars.currentScale) : _p5.windowHeight;
    let ACPECT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT < WIDTH / HEIGHT ? HEIGHT / DEFAULT_HEIGHT : WIDTH / DEFAULT_WIDTH;
    WIDTH = DEFAULT_WIDTH * ACPECT_RATIO;
    HEIGHT = DEFAULT_HEIGHT * ACPECT_RATIO;
    let canvas;

    /** Sketch Starts  */
    let color_main;
    let color_bg;
    let color_fr;

    let overAllTexture;

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT);

        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));
        _p5.rectMode(_p5.CENTER);
        _p5.noLoop();

        /** Setup Starts  */
        color_main = _p5.color(vars.color_main);
        color_bg = _p5.color(vars.color_bg);
        color_fr = _p5.color(vars.color_fr);

        _p5.background(color_bg);
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        overAllTexture = _p5.createGraphics(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        overAllTexture.loadPixels();

        for (let i = 0; i < DEFAULT_WIDTH * .1; i++) {
            for (let o = 0; o < DEFAULT_HEIGHT * .1; o++) {
                overAllTexture.set(
                    i,
                    o,
                    _p5.color(100, _p5.noise(i / 3, o / 3, i * o / 50) * R.r_ar([0, 30, 50]))
                );
            }
        }
        overAllTexture.updatePixels();
        _p5.push();
        _p5.blendMode(_p5.MULTIPLY);
        _p5.image(overAllTexture, 0, 0);
        _p5.pop();
        _p5.push();
        _p5.fill(color_bg);
        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);
        divAng(0,
            DEFAULT_WIDTH * (.7 + (.1 * getStaticScale())),
            _p5.PI * R.r_num(0, .88) * (.5 * getStaticScale()),
            _p5.PI * 2,
            R.r_int(10, 12)
        );
        _p5.pop();
        _p5.push();
        _p5.blendMode(_p5.MULTIPLY);
        _p5.image(overAllTexture, 0, 0);
        _p5.pop();
        _p5.pop();
        _p5.push();
        _p5.translate(_p5.width / 2, _p5.height / 2);
        frameRuler(_p5, false);
        _p5.pop();
        if (vars.backend) {
            vars.onFinish(canvas);
        }
        _p5.noLoop();
    }

    _p5.draw = function () {
        /** Draw Starts */

    };

    function divAng(stR, edR, stAng, edAng, d) {
        let colors = vars.colors;
        _p5.push();
        _p5.rotate(R.r_num(-0.5, 0.5));
        let ww = _p5.pow((edR - stR), 1.3 - d / 4) * R.r_dec();
        let cc = _p5.color(R.r_ar(colors));
        _p5.stroke(cc);
        _p5.strokeWeight(ww);
        _p5.strokeCap(_p5.SQUARE);
        let rr = edR;
        _p5.noFill();
        _p5.arc(0, 0, stR, stR, stAng, edAng);
        let xx1 = (stR - 0.5) * _p5.cos(stAng);
        let yy1 = (stR - 0.5) * _p5.sin(stAng);
        let xx2 = (stR - 0.5) * _p5.cos(edAng);
        let yy2 = (stR - 0.5) * _p5.sin(edAng);
        _p5.push();
        _p5.noStroke();
        _p5.fill(cc);
        _p5.ellipse(xx1, yy1, 5);
        _p5.ellipse(xx2, yy2, 5);
        _p5.pop();
        for (let i = 0; i < 10; i++) {
            _p5.fill(cc);
            _p5.noStroke();
            _p5.ellipse(
                R.r_num(-stR / 2, stR / 2) + xx1,
                R.r_num(-stR / 2, stR / 2) + yy1,
                R.r_num(0, 2) + (.5 * getDynamicScale())
            );
        }
        if (R.r_dec() < .2) {
            _p5.strokeWeight(1);
            _p5.stroke(cc);
            _p5.line(xx1, yy1, xx2, yy2);
        }
        if (R.r_dec() < 0.3) {
            d -= 1;
        }
        _p5.push();
        if (R.r_dec() < 0.05) {
            _p5.stroke(cc);
            _p5.strokeWeight(R.r_num(0, 3));
            _p5.noFill();
            _p5.ellipse(0, 0, rr, rr);
        }
        _p5.pop();
        let ratio = R.r_num(0.3, 0.5) + (.2 * getDynamicScale());
        if (d > 0) {
            if (R.r_dec() < 0.35) {
                let splitNum = R.r_ar([2, 2, 2, 2, 2, 3]);
                for (let o = 1; o <= splitNum; o++) {
                    divAng(stR, edR, stAng + (o - 1) * (edAng - stAng) / splitNum, stAng + o * (edAng - stAng) / splitNum, d - 1);
                }
            } else {
                divAng(stR, stR + ratio * (edR - stR), stAng, edAng, d - 1);
                divAng(stR + ratio * (edR - stR), edR, stAng, edAng, d - 1);
            }
        }
        _p5.pop();
    }

    _p5.windowResized = () => {
        location.reload();
    }

    /** The end of the sketch */
    function getDynamicScale() {
        return R.r_ar(Object.values(vars.collectionData.dynamic)) * vars.dataUsageScale;
    }

    function getStaticScale() {
        return R.r_ar(Object.values(vars.collectionData.static)) * vars.dataUsageScale;
    }
}