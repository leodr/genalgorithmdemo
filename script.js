var points = [];

var factor = 1;

function rescale() {
    var canvas = document.getElementById("canvas");
    var scale = document.getElementById("scaling").value;

    if (!isNaN(scale)) {
        canvas.width = scale * factor;
        canvas.height = scale * factor;
    }
    clearCanvas();
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function generatePoints() {
    var canvas = document.getElementById("canvas");
    var width = document.getElementById("canvas").width / factor;
    var height = document.getElementById("canvas").height / factor;

    points = [];

    for (var i = 0; i < document.getElementById("amount").value; i++) {
        var random1 = Math.floor(Math.random() * width);
        var random2 = Math.floor(Math.random() * height);
        for (var y = 0; y < points.length; y++) {
            try {
                if (points[y].x === random1 && points[y].y === random2) {
                    random1 = Math.floor(Math.random() * width);
                    random2 = Math.floor(Math.random() * height);
                    y--;
                }
            } catch (e) { }
        }
        points[i] = new Point(random1, random2);
    }

    clearCanvas();
    displayPoints();
}

function displayPoints() {
    var canvas = document.getElementById("canvas");
    var width = document.getElementById("canvas").width;
    var height = document.getElementById("canvas").height;

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        for (var i = 0; i < points.length; i++) {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(points[i].x * factor, points[i].y * factor, 3, 0, 2 * Math.PI);
            ctx.fill();
            try {
                ctx.moveTo(points[i + 1].x, points[i + 1].y);
            } catch (e) { }
        }


    }
}

Array.prototype.swap = function (index, otherIndex) {
    var valueAtIndex = this[index];

    this[index] = this[otherIndex];
    this[otherIndex] = valueAtIndex;
}

function bruteForce() {
    var highestFitness = 0;
    var highestFitnessSolution = [];

    var workingPoints = [];

    for (var i = 0; i < points.length; i++) {
        workingPoints.push(i);
    }

    var result = [workingPoints.slice()];

    var length = workingPoints.length;

    var i = 1, heap = new Array(length).fill(0);

    reocurringFunction();

    function reocurringFunction() {
        if (i < length) {
            if (heap[i] < i) {
                workingPoints.swap(i, i % 2 && heap[i])
                var currentFitness = calculateFitness(workingPoints);
                if (currentFitness > highestFitness) {
                    console.log("new best fitness: " + currentFitness);
                    console.log(workingPoints.slice());
                    highestFitness = currentFitness;
                    highestFitnessSolution = workingPoints.slice();
                    drawRoute(highestFitnessSolution);
                }
                result.push(workingPoints.slice())
                heap[i]++
                i = 1
            } else {
                heap[i] = 0
                i++
            }
            setTimeout(reocurringFunction, 0);
        } else {
        }
    }
}

function geneticAlgorithm() {
    var highestFitness = 0;
    var highestFitnessSolution = [];

    var currentGen = [];

    var workingPoints = [];

    for (var i = 0; i < points.length; i++) {
        workingPoints.push(i);
    }

    var popcount = document.getElementById("popcount").value;
    var gencount = document.getElementById("gencount").value;
    var mutchance = document.getElementById("mutchance").value;

    //initialize Population

    for (var i = 0; i < popcount; i++) {
        for (var y = 0; y < workingPoints.length; y++) {
            workingPoints.swap(Math.floor(Math.random() * workingPoints.length), y);
        }
        currentGen.push(workingPoints.slice());
    }

    gen();

    function gen() {
        currentGen = sortByFitness(currentGen);
        tempFitness = calculateFitness(currentGen[0]);
        if (tempFitness > highestFitness) {
            highestFitness = tempFitness;
            highestFitnessSolution = currentGen[0];
            console.log("new best fitness: " + highestFitness);
                    console.log(highestFitnessSolution.slice());
            drawRoute(highestFitnessSolution);
        }
        currentGen = nextGen(currentGen, mutchance).slice();
        setTimeout(gen, 0);
    }
}

function handleGo() {
    if (document.getElementsByName('options')[0].checked) {
        bruteForce();
    } else {
        geneticAlgorithm();
    }
}

function nextGen(currentGen, mutchance) {
    var nextGen = [];

    for (var i = 0; i < currentGen.length; i++) {
        var currentSolution = new Array(currentGen[0].length);

        var random = Math.floor(Math.pow(Math.random(), 2) * currentGen.length);
        var random2 = Math.floor(Math.pow(Math.random(), 2) * currentGen.length);

        var randomStart = Math.floor(Math.random() * currentGen[0].length);
        var randomLength = Math.floor(Math.random() * (currentGen[0].length - randomStart));

        for (var x = randomStart; x < randomStart + randomLength; x++) {
            currentSolution[x] = currentGen[random][x];
        }

        var rotated = false;
        var stop = false;

        var secondArrayCounter = randomStart + randomLength;

        for (var y = randomStart + randomLength; !stop;) {
            var alreadyIn = false;
            if (y > currentGen[0].length - 1) {
                y -= currentGen[0].length;
                rotated = true;
            }
            if (secondArrayCounter > currentGen[random2].length - 1) {
                secondArrayCounter -= currentGen[2].length;
            }
            for (var x = 0; x < currentSolution.length && !alreadyIn; x++) {
                if (currentSolution[x] === currentGen[random2][secondArrayCounter]) {
                    alreadyIn = true;
                    secondArrayCounter++;
                }
            }
            if (!alreadyIn) {
                currentSolution[y] = currentGen[random2][secondArrayCounter];
                y++;
                secondArrayCounter++;
            }
            if (y === randomStart && rotated) {
                stop = true;
            }

        }

        for(var z = 0; z < currentSolution.length; z++) {
            if(Math.random() < mutchance) {
                currentSolution.swap(z, Math.floor(Math.random() * currentSolution.length));
            }
        }
        nextGen.push(currentSolution);
    }
    return nextGen;
}

function sortByFitness(currentGen) {
    var nextGen = currentGen.slice();

    var sorted = false;

    for (var i = 0; i < nextGen.length || !sorted; i++) {
        sorted = true;
        for (var y = 0; y < nextGen.length - i - 1; y++) {
            var firstFitness = calculateFitness(nextGen[y]);
            var secondFitness = calculateFitness(nextGen[y + 1]);

            if (firstFitness < secondFitness) {
                nextGen.swap(y, y + 1);
                sorted = false;
            }
        }
    }

    return nextGen;
}

function drawRoute(array) {
    var canvas = document.getElementById("canvas");
    var width = document.getElementById("canvas").width / factor;
    var height = document.getElementById("canvas").height / factor;

    clearCanvas();
    displayPoints();

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        for (var i = 1; i < array.length; i++) {

            ctx.moveTo(points[array[i - 1]].x * factor, points[array[i - 1]].y * factor);
            ctx.lineTo(points[array[i]].x * factor, points[array[i]].y * factor);
        }
        ctx.stroke();
    }
}

function calculateFitness(array) {
    var distance = 0.0;

    for (var i = 0; i < array.length - 1; i++) {
        distance += Math.sqrt(Math.pow((points[array[i + 1]].x - points[array[i]].x), 2) + Math.pow((points[array[i + 1]].y - points[array[i]].y), 2));
    }

    return 1 / distance;
}

function clearCanvas() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function initializePopulation() {

}