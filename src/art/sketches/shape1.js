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
    let startX;
    let startY;
    let startR = 1;

    let selectedShapes,
        shapeCount = 0;

    let color_main,
        color_bg,
        color_fr,
        color_shadow;

    let cc, cc2, cc3;
    let range, rangeFirst;
    let stopFirstAnimation = false,
        stopEveryFrame = false;

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT);
        _p5.frameRate(vars.backend ? 60 : 6);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));
        _p5.rectMode(_p5.CENTER);

        rangeFirst = range = DEFAULT_WIDTH * (.6 + (.2 * getStaticScale()));

        cc = vars.colors[R.r_int(0, vars.colors - 1)];
        cc2 = vars.colors[R.r_int(0, vars.colors - 1)];
        cc3 = vars.colors[R.r_int(0, vars.colors - 1)];

        color_main = _p5.color(vars.color_main);
        color_bg = _p5.color(vars.color_bg);
        color_fr = _p5.color(vars.color_fr);
        color_shadow = color_bg.setAlpha(150);

        _p5.background(color_bg);

        startX = DEFAULT_WIDTH * R.r_ar([.2, .25, .30, .35, .65, .70, .75, .80]);
        startY = DEFAULT_HEIGHT * R.r_ar([.2, .25, .30, .35, .65, .70, .75, .80]);
        startX += -10 * getStaticScale();
        startY += -10 * getStaticScale();

        selectedShapes = [R.r_int(0, 1), R.r_int(0, 1)];

        _p5.drawingContext.shadowOffsetX = (3 + (1 * getStaticScale())) * ACPECT_RATIO;
        _p5.drawingContext.shadowOffsetY = (4 + (1 * getStaticScale())) * ACPECT_RATIO;
        _p5.drawingContext.shadowBlur = (8 + (1 * getStaticScale())) * ACPECT_RATIO;
        _p5.drawingContext.shadowColor = color_bg;
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        if (stopFirstAnimation) {
            if (vars.backend) {
                vars.onFinish(canvas);
                _p5.noLoop();
            }
        } else {
            drawing();
        }

        _p5.pop();
    };

    function drawing() {
        if (range < (rangeFirst * .7)) {
            for (let j = 0; j < 5; j++) {
                drawGeometries();
            }
        }

        if (R.r_int(0, 10) <= 1) {
            _p5.push();
            _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);

            _p5.strokeWeight(R.r_int(.5, 1.5) + (.5 * getDynamicScale()));

            if (range < DEFAULT_WIDTH * .6) {
                _p5.stroke(vars.colors[R.r_int(0, vars.colors.length - 1)]);
            } else {
                _p5.stroke(color_bg);
            }

            if (range > 10) {
                let rangeWidth, rangeType;
                for (let i = 0; i < R.r_int(0, 360); i++) {
                    _p5.push();
                    _p5.rotate(i);
                    let cc4 = vars.colors[R.r_int(0, vars.colors.length - 1)];


                    _p5.fill(cc4);

                    rangeWidth = R.r_int(range / 4, range) + ((range / 10) * getDynamicScale());

                    rangeType = R.r_int(1, 3);

                    switch (rangeType) {
                        case 1:
                            _p5.circle(0, 0, rangeWidth);
                            break;
                        case 2:
                            _p5.rect(0, 0, rangeWidth * .8, rangeWidth * .8, rangeWidth * R.r_num(0.05, 0.22));
                            break;
                        case 3:
                            _p5.rect(0, 0, rangeWidth * .8, rangeWidth * .8);
                            break;
                    }

                    cc4 = vars.colors[R.r_int(0, vars.colors.length - 1)];
                    _p5.stroke(color_bg);
                    _p5.fill(cc4);
                    _p5.strokeWeight(R.r_num(1, 1));

                    _p5.rect(0, 0, R.r_int(0, range * 1.2), R.r_int(5, 15), R.r_int(5, 15));
                    _p5.rect(0, 0, R.r_int(0, range * 1.3), R.r_int(10, 25), R.r_int(5, 15));
                    _p5.pop();
                }
            }

            _p5.pop();
            cc = vars.colors[R.r_int(0, vars.colors.length - 1)];
            cc2 = vars.colors[R.r_int(0, vars.colors.length - 1)];
            cc3 = vars.colors[R.r_int(0, vars.colors.length - 1)];

            range -= 80;

            if (range < 0) {
                stopFirstAnimation = true;
                stopEveryFrame = true;
            }

        } else {
            let c = _p5.color(R.r_ar(vars.colors));
            if (R.r_dec() >= 0.3) {
                _p5.fill(c);
                _p5.noStroke();
            } else if (R.r_dec() >= 0.6) {
                _p5.strokeWeight(R.r_int(10, 18));
                _p5.stroke(c);
            } else {
                _p5.strokeWeight(R.r_int(14, 24));
                _p5.fill(c);
                _p5.stroke(c);
            }
            _p5.circle(R.r_int(0, DEFAULT_WIDTH * .9), R.r_int(0, DEFAULT_HEIGHT * .9), R.r_num(5.2, 21.9));
        }
    }

    function drawGeometries() {
        shapeCount++;
        if (shapeCount > 250) {
            stopFirstAnimation = true;
        }
        startR += (R.r_num(-1, 1));
        let cr = startR;
        _p5.offset += 0.01;
        if (R.r_int(0, 100) < 1) cr = startR * 3;
        startX += R.r_num(-1, 1) * 20;
        startY += R.r_num(-1, 1) * 20;
        if (startX < 0) {
            startX = DEFAULT_WIDTH;
        }
        if (startX > DEFAULT_WIDTH) {
            startX = 0;
        }
        if (startY < 0) {
            startY = DEFAULT_HEIGHT;
        }
        if (startY > DEFAULT_HEIGHT) {
            startY = 0;
        }
        const n = selectedShapes[R.r_int(0, selectedShapes.length - 1)];
        _p5.push();
        switch (n) {
            case 0:
                drawLeaf({x: startX, y: startY}, vars.colors);
                break;
            case 1:
                drawNoiseCircle(cr, {x: startX, y: startY}, vars.colors);
                break;
        }
        _p5.pop();
    }

    function drawLeaf(position, colors) {
        _p5.push();
        _p5.translate(position.x, position.y);
        _p5.scale(R.r_num(0.5, 1.4));
        _p5.rotate(R.r_int(0, 360));

        const steps = 5 + R.r_int(0, 5);

        let h = 10, off = 0;
        for (let i = 0; i < steps; i++) {
            let c = _p5.color(R.r_ar(colors));

            const newV = {x: off, y: h * i};

            _p5.fill(c);
            _p5.stroke(c);
            if (R.r_dec() >= 0.3) {
                _p5.strokeWeight(R.r_int(0, 2));
                _p5.noFill();
                _p5.square(newV.x, newV.y, R.r_int(1, 8) + (2 * getDynamicScale()));
            } else if (R.r_dec() >= 0.6) {
                _p5.strokeWeight(R.r_int(0, 2));
                _p5.stroke(c);
                _p5.noFill();
                _p5.rect(newV.x, newV.y, R.r_int(10, 20), R.r_int(10, 20), 5 + (2 * getDynamicScale()));
            } else {
                _p5.strokeWeight(R.r_int(0, 3));
                _p5.stroke(c);
                _p5.circle(newV.x, newV.y, R.r_int(1, 10) + (2 * getDynamicScale()));
            }
        }
        _p5.pop();
    }

    function drawNoiseCircle(cr, position, colors) {
        _p5.translate(position.x, position.y);

        let c = _p5.color(R.r_ar(colors));
        _p5.fill(c);
        _p5.stroke(c);
        if (R.r_dec() >= 0.3) {
            _p5.strokeWeight(R.r_int(.5, 2));
            _p5.noFill();
            _p5.square(0, 0, R.r_int(5, 10) + (2 * getDynamicScale()), 5);
        } else if (R.r_dec() >= 0.6) {
            _p5.noFill();
            _p5.circle(0, 0, R.r_int(1, 10) + (2 * getDynamicScale()));
        } else {
            _p5.strokeWeight(R.r_int(1, 3) + (2 * getDynamicScale()));
            _p5.noFill();
            _p5.rect(0, 0, R.r_int(30, 40) + (2 * getDynamicScale()), R.r_int(40, 50) + (2 * getDynamicScale()), 5);
        }
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
