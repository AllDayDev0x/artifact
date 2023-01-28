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

    let sze = 0;
    let rSze = 0;
    let mSze = 0;
    let W = 0;
    let H = 0;
    let col = [0, 0, 0];
    let RGB = 0;
    let nCol = 0;
    let xoff = 0;
    let yoff = 0;
    let zoff = 0;
    let noiseMax = 0;
    let sinVal = [];
    let cosVal = [];
    let rtt = 0;
    let nRtt = 0;
    let rX = 0;
    let rY = 0;
    let rnd = 0;
    let buqet = 0;
    let flwr = true;
    let paused = false;
    let cx = 0;
    let cy = 0;
    let rBg;
    let nZoff;
    let colorFlowCount = 0;
    let shape = 0;
    let shapeComplete = false;

    const seed = R.r_dec() * R.r_num(1000, 9999) * getStaticScale();
    _p5.randomSeed(seed);
    _p5.noiseSeed(seed);

    const rBool = function () {
        return _p5.random() > .5;
    }
    const rInt = function (a, b) {
        return _p5.int(_p5.random(a, b));
    }
    const rNum = function (a, b) {
        return _p5.random(a, b);
    }

    _p5.setup = () => {

        canvas = _p5.createCanvas(WIDTH, HEIGHT);
        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));
        _p5.rectMode(_p5.CENTER);

        /** Setup Starts  */
        _p5.push();
        //_p5.scale(ACPECT_RATIO);

        noiseMax = 1.4;
        nZoff = rNum(0, 1) * (0.03 - 0.01) + (0.005 * getStaticScale());
        nRtt = _p5.round(rNum(0, 1) * (0.3 - 0.01) + 0.02, 6 + (1.5 * getStaticScale()));
        nCol = _p5.round(rNum(0, 1) * (1 - 0.1) + 0.1, 4);
        rSze = rNum(0, 1) * (0.002 - 0.001) + 0.001;
        RGB = _p5.floor(rNum(0, 1) * 3);
        rnd = _p5.round(rNum(0, 1) * (9 - 3) + 3);
        rBg = rNum(0, 1) * (60 - 20) + 20;
        buqet = 1;
        W = DEFAULT_WIDTH;
        H = DEFAULT_HEIGHT;
        rX = W / 2;
        rY = H / 2;

        color_main = _p5.color(vars.color_main);
        color_bg = _p5.color(vars.color_bg);
        color_fr = _p5.color(vars.color_fr);

        _p5.background(color_bg);
        _p5.angleMode(_p5.DEGREES);
        _p5.rectMode(_p5.CENTER);
        _p5.noStroke();

        col = [rNum(0, 1) * 255, rNum(0, 1) * 255, rNum(0, 1) * 255];
        _p5.fill(col);

        for (let i = 0; i < 360; i++) {
            sinVal[i] = _p5.sin(i);
            cosVal[i] = _p5.cos(i);
        }

        shape = rNum(0, 1) > .5 ? 1 : 0;

        if (H < W) {
            sze = H * (shape === 0 ? .65 : .99);
        } else {
            sze = W * (shape === 0 ? .65 : .99);
        }
        mSze = sze;

        _p5.pop();

        if (vars.backend) {
            _p5.noLoop();
            do {
                _p5.push();
                _p5.scale(ACPECT_RATIO);
                if (flwr) {
                    _p5.push();
                    if (shape === 0) {
                        growFlower();
                    }
                    if (shape === 1) {
                        growCircle();
                    }
                    _p5.pop();
                }
                _p5.pop();

                if (shapeComplete) {
                    vars.onFinish(canvas);
                }
            } while (!shapeComplete)
        }

    }

    _p5.draw = function () {
        if (!vars.backend) {
            _p5.push();
            _p5.scale(ACPECT_RATIO);
            /** Draw Starts */
            if (flwr) {
                _p5.push();
                if (shape === 0) {
                    growFlower();
                }
                if (shape === 1) {
                    growCircle();
                }
                _p5.pop();
            }
            _p5.pop();
        }
    };

    function growFlower() {
        _p5.translate(rX, rY);
        _p5.fill(col);
        _p5.stroke(col);
        _p5.push();
        _p5.translate(-rX, -rY);
        cx = rNum(DEFAULT_WIDTH * .1, DEFAULT_WIDTH * .9) + (.2 * getDynamicScale() * rBool() ? 1 : -1);
        cy = rNum(DEFAULT_HEIGHT * .1, DEFAULT_HEIGHT * .9) + (.2 * getDynamicScale() * rBool() ? -1 : 1);
        _p5.drawingContext.shadowOffsetX = 3;
        _p5.drawingContext.shadowOffsetY = 4;
        _p5.drawingContext.shadowBlur = 10;
        _p5.drawingContext.shadowColor = color_bg;
        if (Math.round(rtt) % 20 === 0) {
            _p5.strokeWeight(rNum(0.1, 1));
            _p5.line(rX, rY, cx, cy);
            _p5.circle(cx, cy, 10 + (8 * getDynamicScale()));
        }
        _p5.pop();

        _p5.rotate(rtt);
        rtt += nRtt;
        _p5.noFill();
        _p5.beginShape();
        for (let r, x, y, a = 0; a < 360; a++) {
            xoff = _p5.map(sinVal[a], -1, 1, 0, noiseMax);
            yoff = _p5.map(cosVal[a], -1, 1, 0, noiseMax);
            r = _p5.map(_p5.noise(xoff, yoff, zoff), 0, 1, 0, sze);

            //r = (sze * .7) + (rNum(1, 3) * rBool() ? 1 : -1);
            sze -= rSze;
            x = r * _p5.cos(a);
            y = r * _p5.sin(a);
            _p5.vertex(x, y);
        }
        _p5.endShape(_p5.CLOSE);

        if (Math.round(rtt) % 5 === 0) {
            colorFlow();
        }

        if (sze < 5) {
            rSze *= -1;
            rX = rNum(W);
            rY = rNum(H);

            if (H < W) {
                sze = H * 0.65 * 0.65;
            } else {
                sze = W * 0.65 * 0.65;
            }
            mSze = sze;
            buqet -= 1;
        } else if (sze > mSze) {
            rSze *= -1;
        }

        if (buqet <= 0) {
            buqet = rnd;
            flwr = false;
            paused = true;
            _p5.noLoop();
            shapeComplete = true;
        }
        zoff += nZoff;
    }

    function growCircle() {
        _p5.translate(rX, rY);
        _p5.fill(col);
        _p5.stroke(col);
        _p5.push();
        _p5.translate(-rX, -rY);
        cx = rNum(0, DEFAULT_WIDTH);
        cy = rNum(0, DEFAULT_HEIGHT);
        if (Math.round(rtt) % 20 === 0) {
            _p5.strokeWeight(rNum(0.1, 1));
            _p5.line(rX, rY, cx, cy);
            _p5.rect(cx, cy, 20, 20);
        }
        _p5.pop();

        _p5.push();
        _p5.pop();
        _p5.rotate(rtt);
        rtt += nRtt;
        _p5.noFill();

        xoff = _p5.map(sinVal[1], -1, 1, 0, noiseMax);
        yoff = _p5.map(cosVal[1], -1, 1, 0, noiseMax);
        //let r = _p5.map(_p5.noise(xoff, yoff, zoff), 0, 1, 0, sze);
        let r = (sze * .7) + (rNum(1, 3) * rBool() ? 1 : -1);
        let round = r * .05;
        _p5.rect(10, 10, r, r, round);

        sze -= rSze * 750;

        if (Math.round(rtt) % 5 === 0) {
            colorFlow();
        }

        if (sze < 5) {
            rSze *= -1;
            rX = rNum(W);
            rY = rNum(H);

            if (H < W) {
                sze = H * 0.65 * 0.65;
            } else {
                sze = W * 0.65 * 0.65;
            }
            mSze = sze;
            buqet -= 1;
        } else if (sze > mSze) {
            rSze *= -1;
        }

        if (buqet <= 0) {
            buqet = rnd;
            flwr = false;
            paused = true;
            _p5.noLoop();
            shapeComplete = true;
        }
        zoff += nZoff;
    }

    function colorFlow() {
        colorFlowCount++;
        if (col[RGB] < 0 || col[RGB] > 255) {
            nCol *= -1;
            RGB = _p5.floor(rNum(0, 1) * 3);
        }
        col[RGB] += nCol;
        col = vars.colors[colorFlowCount % vars.colors.length];
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