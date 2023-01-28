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
    let frameCount = 20;

    /** Sketch Starts  */
    let easing = 0.05,
        TargetScrolDelta = .09;
    let mouseHorAR = 0, mouseVerAR = 0, scrolDelta = vars.backend ? 0.09 : .5,
        mousePressed = false;
    let mouseOn = false;
    let num;
    let tRotate = 0.0;
    let vel = .7;
    let pg;

    let color_main;
    let color_bg;
    let color_fr;

    let shapeVariants = [],
        shapeVariantCount = 999;
    let circleIndex = 0;
    let intervalN;
    let shapeScale;

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT);
        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));
        _p5.rectMode(_p5.CENTER);

        /** Setup Starts  */
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

        num = R.r_num(0, 1000) * (150 * getStaticScale());
        _p5.angleMode(_p5.DEGREES)
        pg = _p5.createGraphics(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let i = 0; i < R.r_int(1250, 2500) + (250 * getStaticScale()); i++) {
            pg.fill(R.r_ar(vars.colors))
            pg.noStroke();
            pg.ellipse(_p5.randomGaussian(DEFAULT_WIDTH / 2, DEFAULT_WIDTH * 0.3),
                _p5.randomGaussian(DEFAULT_HEIGHT / 2, DEFAULT_HEIGHT * 0.3),
                R.r_num(0, 1) < 0.99
                    ? R.r_num(DEFAULT_WIDTH * 0.001, DEFAULT_WIDTH * 0.004)
                    : R.r_num(DEFAULT_WIDTH * 0.007, DEFAULT_WIDTH * 0.01))
        }
        let shapeRotateVel,
            shapeEnabled,
            shapeFilled;
        for (let i = 0; i < shapeVariantCount; i++) {
            shapeRotateVel = R.r_num(0.5, 2.4) * R.r_num(0, 1) > .5 ? 1 : -1;
            shapeEnabled = R.r_num(0, 1) > .4;
            shapeFilled = R.r_num(0, 1) > .7;
            shapeVariants.push([shapeRotateVel, shapeEnabled, shapeFilled]);
        }
        shapeScale = 4 * getDynamicScale();
    }

    _p5.draw = function () {
        frameCount = _p5.frameCount;

        _p5.push();
        _p5.scale(ACPECT_RATIO);

        /** Draw Starts */
        scrolDelta = scrolDelta + (TargetScrolDelta - scrolDelta) * easing;
        _p5.randomSeed(num)
        _p5.background(color_bg);
        _p5.image(pg, 0, 0);
        intervalN = _p5.int(_p5.random(50, 80));
        circleIndex = 0;
        for (let i = 0; i < DEFAULT_HEIGHT; i += intervalN) {
            circles(i, DEFAULT_HEIGHT * _p5.random(0.03, 0.05));
            circleIndex++;
        }

        tRotate += vel;
        _p5.pop();
        if (vars.backend) {
            _p5.noLoop();
            vars.onFinish(canvas);
        }

    };

    function circles(radius, w) {
        let col = _p5.color(vars.colors[radius % vars.colors.length]);
        _p5.push();
        _p5.noFill();
        _p5.stroke(col)
        _p5.strokeWeight(.5)//12 * (circleIndex / intervalN)
        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);
        //_p5.scale(((radius / intervalN)) * scrolDelta);
        let shapeN = _p5.int(_p5.random(3, 8 + shapeScale))
        let n = _p5.int(_p5.random(30, 100))
        _p5.beginShape();
        for (let rotAr, i = 0; i < 360; i += 360 / n) {
            rotAr = i + (frameCount * .1 * (circleIndex % 2 === 0 ? 1 : -1)) * scrolDelta * 20;
            let ex = radius * _p5.sin(rotAr) * scrolDelta * 4;
            let ey = radius * _p5.cos(rotAr) * scrolDelta * 4;
            rects(ex, ey, w, shapeN, radius, i, col)
        }
        _p5.endShape(_p5.CLOSE)
        _p5.pop();
    }

    function rects(x, y, w, shapeN, radius, degree, col) {
        let variantIndex = radius * degree;
        let index = Math.round(variantIndex % (shapeVariantCount - 1));
        let shapeEnabled = shapeVariants[index][1];
        if (shapeEnabled) {
            let shapeFilled = shapeVariants[index][2];
            let shapeRotateVel = shapeVariants[index][0] * 2;
            _p5.push();
            if (shapeFilled) {
                let c = _p5.color(col);
                c.setAlpha(70);
                _p5.fill(c);
            }
            _p5.scale(scrolDelta * 10)
            _p5.translate(x, y)
            _p5.rectMode(_p5.CENTER);
            _p5.push();
            _p5.rotate(tRotate * shapeRotateVel);
            let radius = w * .4;
            _p5.beginShape();
            for (let i = 0; i < 360; i += 360 / shapeN) {
                let ex = radius * _p5.sin(i);
                let ey = radius * _p5.cos(i);
                _p5.vertex(ex, ey)
            }
            _p5.endShape(_p5.CLOSE)
            _p5.pop();
            _p5.pop();
        }
    }

    _p5.mouseDragged = function (e) {
        mousePressed = true;
        if (mouseOn) {
            mouseHorAR = (e.offsetX - DEFAULT_WIDTH / 2) / (DEFAULT_WIDTH / 2);
            mouseVerAR = (e.offsetY - DEFAULT_HEIGHT / 2) / (DEFAULT_HEIGHT / 2);

        }
    }

    const scrollAct = function () {
        if (TargetScrolDelta > 1) {
            TargetScrolDelta = 1;
        }
        if (TargetScrolDelta < .08) {
            TargetScrolDelta = .08;
        }
    }

    _p5.mouseWheel = function (e) {
        if (mouseOn) {
            TargetScrolDelta = scrolDelta + ((e.delta > 0 ? -.08 : .08) * scrolDelta * 4);
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
        TargetScrolDelta = scrolDelta + ((_p5.mouseY > touchH ? -.08 : .08) * scrolDelta * 4);
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