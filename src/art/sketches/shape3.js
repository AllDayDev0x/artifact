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
    let seed = R.r_dec() * R.r_int(1000, 9999) * getStaticScale();


    let easing = 0.1,
        TargetScrolDelta = 1.5;
    let mouseHorAR = 0, mouseVerAR = 0, scrolDelta = 1.7,
        mousePressed = false;

    let t;
    let num;
    let mainRadius, radius, mySize;
    let color_main;
    let color_bg;
    let color_fr;
    let v_planet = [];
    let mouseOn = false;
    let mainRadiusScale = .5;
    let d1Dynamic = (10 * getDynamicScale());
    let d2Dynamic = (10 * getDynamicScale());
    let d3Dynamic = (10 * getDynamicScale());

    let xMin = -180 * getDynamicScale(),
        xMax = 80 * getDynamicScale(),
        yMin = -90 * getDynamicScale(),
        yMax = 150 * getDynamicScale(),
        zMin = -170 * getDynamicScale(),
        zMax = 120 * getDynamicScale()
    ;

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT/*, _p5.WEBGL*/);
        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));

        /** Setup Starts  */
        _p5.randomSeed(seed);
        mySize = _p5.min(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        canvas.mouseOver(function () {
            mouseOn = true;
        })
        canvas.mouseOut(function () {
            mouseOn = false;
        })

        color_main = _p5.color(vars.color_main);
        color_bg = _p5.color(vars.color_bg);
        color_fr = _p5.color(vars.color_fr);

        //num = _p5.int(_p5.random(12 * getStaticScale(), 24 * getStaticScale()));
        num = _p5.int(_p5.random(12, 22));

        mainRadius = radius = mySize * 0.85;
        t = 0;

        mainRadiusScale += .5 * getStaticScale();
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);
        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);

        _p5.randomSeed(seed);
        _p5.background(color_bg);

        scrolDelta = scrolDelta + (TargetScrolDelta - scrolDelta) * easing;
        radius = mainRadius * mainRadiusScale * scrolDelta;

        for (let i = 0; i < num; i++) {
            let a = (_p5.TAU / num) * i;
            let x = radius * _p5.sin(a + t) / _p5.random(3, 5) / 1.4;
            let y = radius * _p5.cos(a + t) / _p5.random(2, 3) / 1.1;
            v_planet[i] = _p5.createVector(x, y);
        }
        _p5.push();

        //_p5.translate(WIDTH / 2, HEIGHT / 2);

        for (let q = 0; q < 1 / _p5.min(3, 6); q += 2 * _p5.random(0.02, 0.04)) {
            for (let Rx, Ry, j = 0; j < 1; j++) {
                Rx = (_p5.random(_p5.TAU) + t / 10 + q / _p5.random(55, 220) / 20) * .5;
                Ry = (_p5.random(_p5.PI) - t / 10 - q / _p5.random(85, 320) / 20) * .6;
                _p5.rotate(Rx + mouseHorAR);
                //_p5.rotateY(Ry - mouseVerAR);
                //_p5.rotateZ((_p5.random(_p5.PI / 2) - t / 10 + q / _p5.random(75, 100) / 10) * .2);
                _p5.noFill();
                _p5.strokeWeight(3 * _p5.random(0.31, 2.1));
                _p5.stroke(_p5.random(vars.colors));

                _p5.beginShape();
                // vertex(v_planet[0].x, v_planet[0].y);
                for (let i = 0; i < num; i += 1) {
                    let d = _p5.random(radius / 110, radius / 32) + d1Dynamic;
                    let x_plus = _p5.random(xMin, xMax) / 2.5 + 0.5 * _p5.random(-d, d) / 1.01;
                    let y_plus = _p5.random(yMin, yMax) / 2.5 + 0.5 * _p5.random(-d, d) / 1.01;
                    let z_plus = _p5.random(zMin, zMax) / 2.5 + 0.5 * _p5.random(-d, d) / 1.01;

                    _p5.curveVertex(v_planet[i].x + x_plus, v_planet[i].y + y_plus, z_plus);
                }
                // vertex(v_planet[num - 1].x, v_planet[num - 1].y);
                _p5.endShape(_p5.CLOSE);

                for (let i = 0; i < num; i += 2) {
                    let d = ((1.5 + _p5.sin(t)) * _p5.random(radius / 2, radius / 4));
                    let x_plus = 0.5 * _p5.random(-d, d) / 1.01;
                    let y_plus = 0.5 * _p5.random(-d, d) / 2.01;
                    let z_plus = 0.5 * _p5.random(-d, d) / 3.01;
                    let strokeColor = color_bg;
                    let fillColor = _p5.random(vars.colors);
                    let strokeWeight = _p5.random(0.8, 1.5);
                    let is_cube = _p5.random() > .5;

                    if (is_cube) {
                        //_p5.stroke(_p5.random(vars.colors));
                        _p5.stroke(strokeColor);
                        _p5.strokeWeight(strokeWeight);
                        _p5.fill(fillColor);
                        //_p5.fill(_p5.lerpColor(_p5.color(_p5.random(vars.colors)), _p5.color(100), .8));
                    } else {
                        _p5.stroke(strokeColor);
                        _p5.strokeWeight(0.3);
                        _p5.fill(fillColor);
                    }

                    _p5.push();
                    _p5.translate(v_planet[i].x + x_plus, v_planet[i].y + y_plus, z_plus);
                    //_p5.rotateX(t + (mouseHorAR / 2) * 1.2);
                    _p5.rotate(t + (mouseVerAR / 2) * 1.3);
                    //_p5.rotateZ(t * 1.2);

                    if (is_cube) {
                        _p5.push();
                        let w = _p5.int(_p5.random(24, 48));
                        let shapeN = _p5.int(_p5.random(3, 6));
                        radius = w / 2;
                        _p5.beginShape();
                        for (let i = 0; i < _p5.TWO_PI; i += _p5.TWO_PI / shapeN) {
                            let ex = radius * _p5.sin(i);
                            let ey = radius * _p5.cos(i);
                            _p5.vertex(ex, ey)
                        }

                        if (w < 30) {
                            _p5.beginContour();
                            for (let i = _p5.TWO_PI; i >= 0; i -= _p5.TWO_PI / shapeN) {
                                let ex = radius * .3 * _p5.sin(i);
                                let ey = radius * .3 * _p5.cos(i);
                                _p5.vertex(ex, ey)
                            }
                            _p5.endContour();
                        }
                        _p5.endShape(_p5.CLOSE)
                        _p5.pop();

                        //_p5.box(_p5.random(4, 24));
                    } else {
                        if (_p5.random() > .5) {
                            let d = _p5.random(9, 22) + d2Dynamic;
                            if (_p5.random() > .8) {
                                _p5.circle(0, 0, d);
                            } else {
                                _p5.push();
                                _p5.beginShape();
                                for (let i = 0; i <= _p5.TWO_PI; i += _p5.TWO_PI / 60) {
                                    let ex = d * _p5.sin(i);
                                    let ey = d * _p5.cos(i);
                                    _p5.vertex(ex, ey)
                                }
                                let rsamll =_p5.random(.1, .5)
                                _p5.beginContour();
                                for (let i = _p5.TWO_PI; i >= 0; i -= _p5.TWO_PI / 20) {
                                    let ex = d * rsamll * _p5.sin(i);
                                    let ey = d * rsamll * _p5.cos(i);
                                    _p5.vertex(ex, ey)
                                }
                                _p5.endContour();
                                _p5.endShape(_p5.CLOSE)
                                _p5.pop();
                            }
                            //_p5.torus(d, d / 2);
                        } else {
                            _p5.rect(0, 0, _p5.random(14, 34), _p5.random(14, 34));
                            //_p5.sphere(_p5.random(2, 20) + d3Dynamic);
                        }
                    }
                    //_p5.box(vars.collectionData.stats.seven_day_sales);
                    _p5.pop();
                }
            }
        }
        _p5.pop();

        t += 2 * _p5.random(2, 1) * _p5.random(0.001, 0.005) / 5;

        _p5.pop();

        if (vars.backend) {
            vars.onFinish(canvas);
            _p5.noLoop();
        }

    };

    _p5.mouseDragged = function (e) {
        mousePressed = true;
        if (mouseOn) {
            mouseHorAR += (e.offsetX - _p5.width / 2) / (_p5.width / 2) * .01;
            mouseVerAR += (e.offsetY - _p5.height / 2) / (_p5.height / 2) * .01;
        }

    }
    _p5.mouseReleased = function () {
        mousePressed = false;
    }

    const scrollAct = function () {
        if (TargetScrolDelta > 3.5) {
            TargetScrolDelta = 3.5;
        }
        if (TargetScrolDelta < .2) {
            TargetScrolDelta = .2;
        }
    }

    _p5.mouseWheel = function (e) {
        if (mouseOn) {
            TargetScrolDelta = scrolDelta + (e.delta > 0 ? -.8 : .8);

            scrollAct();

            e.preventDefault();
            e.stopPropagation();

            return false;
        }
    }
    let touchH = 0;
    _p5.touchStarted = (e) => {
        touchH = _p5.mouseY;
    }
    _p5.touchMoved = (e) => {
        TargetScrolDelta = scrolDelta + (_p5.mouseY > touchH ? -.8 : .8);
        scrollAct();
        touchH = _p5.mouseY;
        e.preventDefault();
        return false;
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