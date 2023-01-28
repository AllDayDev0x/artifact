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
        startTargetScrolDelta = 1.3,
        TargetScrolDelta = startTargetScrolDelta;
    let mouseHorAR = 0, mouseVerAR = 0, scrolDelta = vars.backend ? 1.3 : .01,
        mousePressed = false;
    let mouseOn = false;

    let color_main;
    let color_bg;
    let color_fr;

    let rayCount;
    let yy;
    let rectColor;
    let ColorIndex;
    let arIndex = 0;
    const rayAr = R.r_int(5, 7);
    const rayWeight = R.r_num(0.4, 0.6) + (.1 * getStaticScale());
    const startRotate = R.r_int(0, 360) * getStaticScale();
    let smallerRatio;
    let enableLines = [];
    let mainScale;
    let mainScaleDynamic;
    let NumberBarsScaleDynamic;
    let mainRotate;
    let circleR;
    let randomNumbers = [];
    let randomNumberScales = [];

    _p5.setup = () => {
        canvas = _p5.createCanvas(WIDTH, HEIGHT);
        _p5.frameRate(60);
        _p5.pixelDensity(_p5.max(1, ACPECT_RATIO));

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

        rayCount = R.r_int(DEFAULT_WIDTH, DEFAULT_WIDTH / 4) + ((DEFAULT_WIDTH / 4) * getStaticScale());

        //console.log(rayCount);
        rectColor = R.r_ar(vars.colors);
        NumberBarsScaleDynamic = (5 * getDynamicScale()) + (R.r_bool() ? 1 : -1);
        for (let x = 0; x < rayCount; x++) {
            enableLines.push(R.r_num(0, 1) > .4);
            if (R.r_num(0, 1) > .4) {
                randomNumbers.push((R.r_num(0, 1) > .8 ? R.r_int(0, 12) : -1));
                randomNumberScales.push(R.r_num(.5, 1.2));
            }
        }
        mainScaleDynamic = _p5.max(6, _p5.min(4, 2 * getDynamicScale()));
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        /** Draw Starts */
        _p5.background(color_bg);
        scrolDelta = scrolDelta + (TargetScrolDelta - scrolDelta) * easing;

        _p5.push()
        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);


        ColorIndex = 0;
        for (let x = 0; x < rayCount; x++) {
            ColorIndex++;
            arIndex = (ColorIndex) / rayCount;
            smallerRatio = (x / rayCount);


            _p5.push()
            _p5.noStroke()
            _p5.fill(rectColor);

            mainScale = _p5.noise(x / 100, _p5.frameCount / 2000, _p5.frameCount / 200) * .6 + mainScaleDynamic;
            mainScale = _p5.min(mainScale, 4.5);
            _p5.scale(mainScale);

            mainRotate = startRotate;
            mainRotate += _p5.noise(x / 100, _p5.frameCount / 2000, +_p5.frameCount / 200) + _p5.sin(x / 100) / 5;
            mainRotate += x / (rayCount / 12);
            _p5.rotate(mainRotate + mouseHorAR);

            if (x === 0 || Math.round(x) % Math.round(rayCount / 30) === 0) {
                rectColor = vars.colors[ColorIndex % vars.colors.length];
                rectColor = _p5.color(rectColor);
            }
            rectColor.setAlpha((arIndex * 255));

            // rays
            yy = (DEFAULT_HEIGHT / rayAr * _p5.noise(x / 100, _p5.frameCount / 2000, 500) / arIndex / 1.1) * (x / rayCount) * scrolDelta;
            if (enableLines[x]) {
                circleR = rayWeight * 6 * arIndex * smallerRatio * .45;
                _p5.circle((rayWeight * arIndex / 2), (yy + (circleR / 2)) * smallerRatio, circleR);
                _p5.rect(0, 0, rayWeight * arIndex, yy * smallerRatio)
            }
            //_p5.circle(_p5.noise(x / 5) * 100 + x / 20, 0, _p5.noise(x) * 2);
            let partcX = (_p5.noise(x / 5) * 100 + x / 20 * scrolDelta) + NumberBarsScaleDynamic,
                partcY = _p5.noise(x) * 1;
            if (randomNumbers[x] > -1) {
                _p5.textSize(10 * randomNumberScales[x]);
                _p5.push();
                _p5.text(randomNumbers[x], partcX, partcY)
                _p5.circle(partcX - 2, partcY - 3, 2);
                _p5.noFill();
                _p5.stroke(rectColor);
                _p5.strokeWeight(.3);
                _p5.line(0, 0, partcX - 3, partcY - 3);
                _p5.pop();
                //_p5.rect(0, 0, rayWeight * arIndex, yy * smallerRatio)
            } else {
                _p5.rect(partcX, partcY, _p5.noise(x) * 2)
            }


            _p5.pop()
        }

        _p5.pop();
        if (vars.backend && scrolDelta > 1.2) {
            vars.onFinish(canvas);
            _p5.noLoop();
        }
    };

    _p5.mouseDragged = function (e) {
        mousePressed = true;
        mouseHorAR += (e.offsetX - DEFAULT_WIDTH / 2) / (DEFAULT_WIDTH / 2) * .1;
        mouseVerAR += (e.offsetY - DEFAULT_HEIGHT / 2) / (DEFAULT_HEIGHT / 2) * .1;
        if (mouseOn) {

        }
    }

    const scrollAct = function () {
        if (TargetScrolDelta > 2) {
            TargetScrolDelta = 2;
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