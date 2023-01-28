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
    let easing = 0.2,
        targetCount = 0;
    const stepData = getData();
    let mainSizeScale, circleSteps;

    // arrays of jason data.
    let transactions = [];
    let nft = [];
    let distance = [];
    let colors = [];

    let count = 0;
    let color_main;
    let color_bg;
    let color_fr;
    let mouseOn = false;


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

        _p5.textSize(14);

        targetCount = count = Math.round((vars.dataMax / 2) + vars.dataMax * .2 * getStaticScale());
        mainSizeScale = Math.min(.85, .65 + (.2 * getStaticScale()));
        circleSteps = Math.floor(_p5.map(getStaticScale(), 0, 1, 50, 90));

        //pass data from json file to arrays
        for (let i = 0; i <= vars.dataMax; i++) {
            transactions[i] = stepData[i].count;
            nft[i] = stepData[i].calorie;
            distance[i] = stepData[i].distance;
            colors[i] = stepData[i].color;
        }
        _p5.colorMode(_p5.HSB, 255);
    }

    _p5.draw = function () {
        _p5.push();
        _p5.scale(ACPECT_RATIO);

        /** Draw Starts */
        _p5.background(color_bg);
        _p5.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);
        //had to scale it to better fit screen.
        _p5.scale(mainSizeScale);
        _p5.noStroke();
        count = count + (targetCount - count) * easing;

        for (let i = 140; i <= 650; i += circleSteps) {
            _p5.noFill();
            _p5.strokeWeight(1);
            _p5.stroke(vars.colors[i % vars.colors.length]);

            if (i === 540) {
                _p5.strokeWeight(1)
            }
            _p5.ellipse(0, 0, i, i);
        }

        //visualise data.
        _p5.beginShape();
        for (let i = 1; i <= count; i++) {

            //set color alpha value according to speed measured. The darker the color the faster I was walking
            _p5.strokeWeight(_p5.map(count, 0, vars.dataMax, 5, 1));//decreasing strokeWeight as displayed lines are increased.
            _p5.strokeCap(_p5.SQUARE);

            _p5.stroke(vars.colors[colors[i]]);
            _p5.fill(vars.colors[colors[i]]);

            //draw a line perpendicular to a circle that has the length of the transactions done each day.
            let angle = _p5.map(i, 0, count, 0, _p5.TWO_PI);//equally spacing lines along the circle.
            let lineLength = _p5.map(transactions[i], 0, _p5.max(transactions), 0, 220);
            let radius = 80; //radius of the internal cycle.
            let x1 = radius * _p5.cos(angle);
            let y1 = radius * _p5.sin(angle);
            let x2 = (radius + lineLength) * _p5.cos(angle);
            let y2 = (radius + lineLength) * _p5.sin(angle);
            _p5.line(x1, y1, x2, y2);

            //draw a circle at the end of the line that its radius is representative
            //of the nft burnt through walking.
            let r = _p5.map(nft[i], 0, _p5.max(nft), 0, 25);//the smaller the circle the smaller the amount of nft burnt.(dah)
            let x = (radius + lineLength + 10) * _p5.cos(angle); //20px away from the end of the line.
            let y = (radius + lineLength + 10) * _p5.sin(angle);
            _p5.strokeWeight(1);
            _p5.ellipse(x, y, r, r);

            //draw a vertex that demonstrates the estimated walked distance.
            //The close to the center means small distance.Range between 2 external circles with a step of 14.000 m.
            let walkedDistance = _p5.map(distance[i], 0, _p5.max(distance), 240, 330);
            let vx = (walkedDistance) * _p5.cos(angle);
            let vy = (walkedDistance) * _p5.sin(angle);

            _p5.noFill();
            _p5.stroke(0, 0, 255);
            _p5.strokeWeight(2);
            _p5.curveVertex(vx, vy);

        }
        _p5.endShape(_p5.CLOSE);

        _p5.scale(1.25);
        _p5.fill(color_fr);
        _p5.noStroke();
        _p5.textAlign(_p5.CENTER);
        _p5.text("Block No\n" + Math.round(targetCount) + ' / ' + vars.dataMax, 0, 0);

        _p5.pop();
        if (vars.backend) {
            vars.onFinish(canvas);
            _p5.noLoop();
        }
    };

    const scrollAct = function () {
        if (targetCount > vars.dataMax) {
            targetCount = vars.dataMax;
        }
        if (targetCount < 5) {
            targetCount = 5;
        }
    }
    _p5.mouseWheel = function (e) {
        if (mouseOn) {
            targetCount = count + (2 * (e.delta > 0 ? 5 : -5));
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
        targetCount = count + (4 * (_p5.mouseY > touchH ? 5 : -5));
        scrollAct();
        touchH = _p5.mouseY;
        e.preventDefault();
        return false;
    }


    function getData() {
        const dataLen = Object.keys(vars.transactions).length;
        let returnData = [], row,
            distance,
            count,
            calorie;

        /** Distance Averages */
        const distanceKey = "cumulativeGasUsed";
        let distanceMin = vars.collectionData.transactionMin[distanceKey];
        let distanceMax = vars.collectionData.transactionMax[distanceKey];
        const distanceAverage = (distanceMin + distanceMax) / 2;
        distanceMin += distanceAverage * .2;
        distanceMax -= distanceAverage * .2;

        /** Count Averages */
        const countKey = "transactionIndex";
        let countMin = vars.collectionData.transactionMin[countKey];
        let countMax = vars.collectionData.transactionMax[countKey];
        const countAverage = (countMin + countMax) / 2;
        countMin += countAverage * .3;
        countMax -= countAverage * .3;

        /** Calorie Averages */
        const calorieKey = "gas";
        let calorieMin = vars.collectionData.transactionMin[calorieKey];
        let calorieMax = vars.collectionData.transactionMax[calorieKey];
        const calorieAverage = (calorieMin + calorieMax) / 2;
        calorieMin += calorieAverage * .1;
        calorieMax -= calorieAverage * .1;

        for (let i = vars.dataStartIndex; i <= vars.dataStartIndex + vars.dataMax; i++) {
            row = vars.transactions[i % dataLen];

            /** Distance */
            distance = Math.abs(_p5.map(row[distanceKey], distanceMin, distanceMax, 2, 7)) + (1 * getDynamicScale());

            /** Count */
            count = Math.abs(_p5.map(row[countKey], countMin, countMax, 100, 500)) + (40 * getDynamicScale());

            /** Calorie */
            calorie = Math.abs(_p5.map(row[calorieKey], calorieMin, calorieMax, 8, 12)) + (4 * getDynamicScale());

            returnData.push({
                distance: Math.round(distance),
                count: Math.round(count),
                calorie: Math.round(calorie),
                color: Math.round(count) % vars.colors.length,
            });
        }
        return returnData;
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
