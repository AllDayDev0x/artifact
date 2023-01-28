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
    let easing = 0.05,
        TargetScrolDelta = 1.54,
        scrolDelta = vars.backend ? TargetScrolDelta : 10;
    let mouseOn = false;

    let color_main;
    let color_bg;
    let color_fr;

    let turnSpeed = R.r_int(100, 250);

    let count;

    let countVariants = [];
    let positionVariants = [];
    let rotationFrequent;
    let rotationSize;

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT);
        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));

        /** Setup Starts */
        canvas.mouseOver(function () {
            mouseOn = true;
        })
        canvas.mouseOut(function () {
            mouseOn = false;
        })

        color_main = _p5.color(vars.color_main);
        color_bg = _p5.color(vars.color_bg);
        color_fr = _p5.color(vars.color_fr);

        _p5.background(color_bg);

        count = R.r_int(20, 40 + (20 * getStaticScale()));

        for (let i = 0; i < count; i++) {
            countVariants.push(R.r_int(24, 60) + (26 * getStaticScale()));
        }
        let positionX, positionY, edgeN, circleOrNot;
        for (let i = 0; i < count; i++) {
            positionX = _p5.sin(i + turnSpeed)
            positionY = _p5.cos(i + DEFAULT_WIDTH * .6);
            edgeN = R.r_int(3, 8);
            circleOrNot = R.r_bool();
            positionVariants.push([positionX, positionY, edgeN, circleOrNot]);
        }

        rotationFrequent = getDynamicScale() * 250;
        rotationSize = (getDynamicScale() * .2);
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        /** Draw Starts */
        _p5.fill(color_bg);
        _p5.push();
        _p5.rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        scrolDelta = scrolDelta + (TargetScrolDelta - scrolDelta) * easing;

        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);
        _p5.noStroke();
        _p5.rectMode(_p5.CENTER);
        let cc, tmpW, iAr;
        let positionX, positionY;
        for (let i = 0; i < count; i++) {
            iAr = i / count;
            let r = (DEFAULT_WIDTH * (.3 + rotationSize) + _p5.sin(i / count) * DEFAULT_WIDTH * .45) * scrolDelta * (1 / 4);

            _p5.push();
            _p5.rotate((
                i * 2 * _p5.PI / count + _p5.noise(i * 50, count * 10, _p5.frameCount / (500 + rotationFrequent)) * 0.2
            ));
            positionX = positionVariants[i][0] * r;
            positionY = positionVariants[i][0] * r;
            _p5.translate(positionX, positionY);

            cc = vars.colors[(i) % vars.colors.length];
            _p5.noStroke();
            _p5.fill(cc);
            _p5.rotate(_p5.sin(scrolDelta));

            tmpW = countVariants[i] * scrolDelta * scrolDelta * .38;

            // circleOrNot
            if (positionVariants[i][3]) {
                _p5.rect(0, 0, tmpW, tmpW, tmpW * iAr);
            } else {
                _p5.push();
                _p5.rectMode(_p5.CENTER);
                _p5.beginShape();
                for (let j = 0; j < _p5.TWO_PI; j += _p5.TWO_PI / positionVariants[i][2]) {
                    let ex = tmpW * _p5.sin(j);
                    let ey = tmpW * _p5.cos(j);
                    _p5.vertex(ex, ey)
                }
                _p5.endShape(_p5.CLOSE)
                _p5.pop();
            }

            if (i % 4 === 0) {
                _p5.stroke(vars.colors[(i + 1) % vars.colors.length]);
                _p5.noFill();
                _p5.strokeWeight(count / 250 * 2);
                _p5.rectMode(_p5.CORNER);
                _p5.rect(-30, -30, ((400 * scrolDelta) + count), 30 + 30, count);
                _p5.noStroke();
                _p5.fill(vars.colors[(i + 1) % vars.colors.length]);
                _p5.circle(0, 0, 7);
            }
            if (i % 20 === 0) {
                _p5.stroke(color_fr);
                _p5.rotate(_p5.PI * count / 10);
                for (let m = 0; m < count; m++) {
                    _p5.translate(count / 3, count / 2);
                    _p5.strokeWeight(m % 10 === 0 ? 3 : 1);
                    _p5.line(0, 0, m % 10 === 0 ? 20 : 5, 0);
                }
            }
            _p5.pop();
        }
        _p5.pop();
        _p5.pop();

        if (vars.backend) {
            vars.onFinish(canvas);
            _p5.noLoop();
        }
    };

    const scrollAct = function () {
        if (TargetScrolDelta > 3) {
            TargetScrolDelta = 3;
        }
        if (TargetScrolDelta < .4) {
            TargetScrolDelta = .4;
        }
    }

    _p5.mouseWheel = function (e) {
        if (mouseOn) {
            TargetScrolDelta = scrolDelta + (e.delta > 0 ? -.4 : .4);
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
        TargetScrolDelta = scrolDelta + (_p5.mouseY > touchH ? -.4 : .4);
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