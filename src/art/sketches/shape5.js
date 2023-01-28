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
    let easing = 0.1,
        targetAllScale = 3,
        allScale = 3;
    let oneEasing = 0.05,
        targetOneMin = 1,
        targetOneMax = 3,
        targetOneScale = 1,
        oneScale = 1;
    let mouseOn = false,
        mouseX = 0, mouseY = 0,
        mousePressed = false,
        mouseClicked = false;
    let color_main;
    let color_bg;
    let color_fr;
    let indexMax;
    let shapes = [];
    let shapeRow;
    let d1Dynamic = (10 * getDynamicScale());
    let d2Dynamic = (10 * getDynamicScale());
    let d3Dynamic = (10 * getDynamicScale());

    let rotateIndexAll = .01;

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
        indexMax = 15 + R.r_int(0, 25);

        for (let i = 0; i < indexMax; i++) {
            shapes.push(new Shape(i));
        }
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        /** Draw Starts */
        allScale = allScale + (targetAllScale - allScale) * easing;
        oneScale = oneScale + (targetOneScale - oneScale) * oneEasing;
        _p5.background(color_bg);

        for (let i = 0; i < indexMax; i++) {
            shapeRow = shapes[i];
            _p5.strokeWeight(shapeRow.sw);
            _p5.stroke(shapeRow.sc);
            _p5.line(shapeRow.x + shapeRow.l1x, shapeRow.y, shapeRow.x - shapeRow.l1y, shapeRow.y + d3Dynamic);
            _p5.line(shapeRow.x, shapeRow.y + shapeRow.l2x, shapeRow.x, shapeRow.y - shapeRow.l2y + d3Dynamic);
            form(shapeRow);
        }

        rotateIndexAll += .01;
        if (rotateIndexAll === 1) {
            rotateIndexAll = .01;
        }

        _p5.pop();

        if (vars.backend) {
            vars.onFinish(canvas);
            _p5.noLoop();
        }
    };

    class Shape {
        i = 0;
        x = 0;
        y = 0;
        d = 0;
        sw = 0;
        sc = 0;
        l1x = 0;
        l1y = 0;
        l2x = 0;
        l2y = 0;
        formRnd = 0;
        formShpRnd1 = 0;
        formShpRnd2 = 0;
        formSW = 0;
        arcRnd = 0;
        targetX = 0;
        targetY = 0;
        scale;
        targetScale;
        anim;

        constructor(_i) {
            this.scale = targetOneMin;
            this.targetScale = targetOneMin;
            this.anim = false;
            this.i = _i;
            this.targetX = this.x = _i === 0 ? R.r_num(0.35, .60) * DEFAULT_WIDTH : R.r_num(0.05, .95) * DEFAULT_WIDTH;
            this.targetY = this.y = _i === 0 ? R.r_num(0.35, .60) * DEFAULT_HEIGHT : R.r_num(0.05, .95) * DEFAULT_HEIGHT;

            if (_i === 0) {
                this.d = R.r_num(DEFAULT_WIDTH / 3, DEFAULT_WIDTH / 4) * R.r_num(2, 3);
            } else {
                this.d = R.r_num(DEFAULT_WIDTH * 0.07, DEFAULT_WIDTH * 0.4) + (.3 * getStaticScale());
            }

            this.sw = R.r_num(0, .5);
            this.sc = R.r_ar(vars.colors);
            this.l1x = R.r_int(0, DEFAULT_WIDTH / 7);
            this.l1y = R.r_int(0, DEFAULT_WIDTH / 6);
            this.l2x = R.r_int(0, DEFAULT_WIDTH / 5);
            this.l2y = R.r_int(0, DEFAULT_WIDTH / 4);
            this.formRnd = R.r_int(0, 1);

            this.formShpRnd1 = Math.floor(R.r_num(2, 3) + (5 * getStaticScale()));
            this.formShpRnd2 = R.r_int(4, 12);
            this.formSW = R.r_num(0.1, 1);
            this.arcRnd = R.r_int(2, 4);
            this.circleAr = R.r_num(.5, .9);
        }
    }

    function form(thisShape) {
        let x = thisShape.x;
        let y = thisShape.y;
        let d = thisShape.d;

        _p5.push();
        _p5.translate(x, y);

        if (mouseClicked) {
            if (
                Math.abs(mouseX - (thisShape.x * ACPECT_RATIO)) < 30 &&
                Math.abs(mouseY - (thisShape.y * ACPECT_RATIO)) < 30
            ) {
                if (!thisShape.anim) {
                    if (thisShape.scale === targetOneMin) {
                        thisShape.anim = true;
                        thisShape.targetScale = targetOneMax;
                    }
                    if (thisShape.scale === targetOneMax) {
                        thisShape.anim = true;
                        thisShape.targetScale = targetOneMin;
                    }
                }
            }
        }

        if (thisShape.anim) {
            thisShape.scale = thisShape.scale + (thisShape.targetScale - thisShape.scale) * easing;
            if (thisShape.scale + (easing * .1) > targetOneMax) {
                thisShape.scale = targetOneMax;
            }
            if (thisShape.scale - (easing * .1) < targetOneMin) {
                thisShape.scale = targetOneMin;
            }
        }
        _p5.scale(thisShape.scale);
        if (thisShape.anim && thisShape.scale === thisShape.targetScale) {
            thisShape.anim = false;
        }

        _p5.rotate(_p5.PI * 0.25 * thisShape.formRnd);
        _p5.noStroke();
        if (thisShape.formRnd === 0) {
            for (let i = 0; i < thisShape.formShpRnd1; i++) {
                let dd = _p5.map(i, 0, thisShape.formShpRnd1, d * 0.4, 0) + d2Dynamic;
                _p5.fill(vars.colors[Math.round(i) % vars.colors.length]);
                _p5.circle(0, 0, dd);
            }
        } else if (thisShape.formRnd === 1) {
            for (let i = 0; i < thisShape.formShpRnd2; i++) {
                _p5.rotate((_p5.TAU / thisShape.formShpRnd2 * allScale) + (rotateIndexAll / 10));
                _p5.fill(vars.colors[i % vars.colors.length]);
                _p5.arc(0, 0, d * 0.4, d * 0.4, -0.02, _p5.TAU / thisShape.formShpRnd2);
            }
        }
        _p5.noFill();
        _p5.strokeWeight(thisShape.formSW);
        _p5.stroke(vars.colors[Math.round(d) % vars.colors.length]);
        for (let i = 0; i < 4; i++) {
            _p5.rotate(_p5.PI * 0.5 * allScale + (rotateIndexAll / 10));
            arcForm(thisShape);
        }
        _p5.pop();
    }

    function arcForm(shapeRow) {
        let x = 0;
        let y = 0;
        let d = shapeRow.d * shapeRow.circleAr + d1Dynamic;
        _p5.arc(x, y, d, d, 0, _p5.PI * 0.2);
        _p5.arc(x, y, d, d, _p5.PI * 0.3, _p5.PI * 0.5);
        _p5.rect(x + d * 0.5 * _p5.cos(_p5.PI * 0.25), y + d * 0.5 * _p5.cos(_p5.PI * 0.25), d * 0.05);
    }

    _p5.mouseMoved = function (e) {
        if (mouseOn) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }
    }
    _p5.mouseDragged = function () {
        if (mouseOn) {
            mousePressed = true;
        }
    }
    _p5.mouseReleased = function () {
        mousePressed = false;
        mouseClicked = false;
    }
    _p5.mousePressed = function () {
        if (mouseOn) {
            mouseClicked = true;
        }
    }

    const scrollAct = function () {
        if (targetAllScale > vars.dataMax) {
            targetAllScale = vars.dataMax;
        }
        if (targetAllScale > 10) {
            targetAllScale = 10;
        }
        if (targetAllScale < 1) {
            targetAllScale = 1;
        }
    }

    _p5.mouseWheel = function (e) {
        if (mouseOn) {
            targetAllScale = allScale + (e.delta > 0 ? .5 : -.5);
            scrollAct();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    let touchH = 0;
    _p5.touchStarted = () => {
        touchH = _p5.mouseY;
    }
    _p5.touchMoved = (e) => {
        targetAllScale = allScale + (_p5.mouseY > touchH ? .5 : -.5);
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