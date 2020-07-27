
var mainThread;
//Helpers
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function replaceElementHtml (id, element) {
    document.getElementById(id).innerHTML = element
}
function walkMatrix (matrix, callback) {
    matrix.forEach((row, y) => row.forEach((pixel, x) =>{
        callback(y,x,pixel)
    }))
}
//Drawing tools
const PIXEL_SIZE = 10
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const drawPixel = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(PIXEL_SIZE*x, PIXEL_SIZE*y, PIXEL_SIZE, PIXEL_SIZE);
}
const drawMatrix = (matrix) => {
    walkMatrix(matrix, (y,x,pixel) =>{
        const isAlive = pixel === 1
        const color = isAlive ? "black" : "white"
        drawPixel(x,y,color)
    })
    showGrid && drawGrid(matrix)
}
function drawGrid(matrix){
    const matrixHeight = matrix.length
    const matrixWidth = matrix[0].length
    const pixelWidth = PIXEL_SIZE*(matrixWidth-1)//hack
    const pixelHeight = PIXEL_SIZE*(matrixHeight-1)//hack

    for (var i = 0; i < matrixWidth; i++) {
        ctx.moveTo(0.5 +PIXEL_SIZE*i, 0);
        ctx.lineTo(0.5 +PIXEL_SIZE*i, pixelHeight);
    }

    for (var i = 0; i < matrixHeight; i++) {
        ctx.moveTo(0, 0.5 +PIXEL_SIZE*i);
        ctx.lineTo(pixelWidth, 0.5 + PIXEL_SIZE*i);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}

//Matrix tools
const calculateNeighborsAlive = (matrix, center) => {
    const [y, x] = center
    const path = [
        { x: x, y: y+1 },
        { x: x, y: y-1 },
        { x: x+1, y: y },
        { x: x+1, y: y-1 },
        { x: x+1, y: y+1 },
        { x: x-1, y: y },
        { x: x-1, y: y-1 },
        { x: x-1, y: y+1 },
    ]
    var acc = 0
    for (var i = 0; i < path.length; i++) {
        const { y: pathY, x: pathX } = path[i]
        const currentValue = matrix[pathY][pathX]
        acc += currentValue
    }
    return acc
    
}

const generateWorld = (width, height, seed) => {
    var newWorld = [];
    for(var i=0; i<width; i++) {
            newWorld[i]=[]
        for(var j=0; j<height; j++) {
            newWorld[i][j] = 0
        }
    }
    PIXEL_SIZE
    if (seed) {
        walkMatrix(seed, (y,x) => {
            newWorld[y][x] = seed[y][x]
        })
    }
    return newWorld
}

//Game of life
const WORLD_SEED = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
]
let WORLD = WORLD_SEED
const lifePulse = (matrix) => {
    let newMatrix = matrix.map(function(arr) {
        return arr.slice();
    });
    const matrixHeight = matrix.length - 1
    const matrixWidth = matrix[0].length - 1

    matrix.forEach((row, y) => row.forEach((pixel, x) => {
        const isBorder = x === 0 || y === 0 || x === matrixWidth || y === matrixHeight
        if(!isBorder) {
            const isAlive = pixel === 1
            const neighborsAlive = calculateNeighborsAlive(matrix, [y,x])

            if(isAlive){
                const hasTwoNeighbors = neighborsAlive == 2 || neighborsAlive == 3
                const justDie = !hasTwoNeighbors

                if(justDie) {
                    newMatrix[y][x] = 0
                }
            } else {
                const hasThreeNeighbors = neighborsAlive == 3
                const beBorn = hasThreeNeighbors

                if(beBorn) {
                    newMatrix[y][x] = 1
                }
            }
        }
    }))

    return newMatrix
}
function live() {
    WORLD = lifePulse(WORLD);

    drawMatrix(WORLD);
}


//Controls
let gameRunning = false
let showGrid = false

const playGame = () => {
    if(gameRunning) {
        clearInterval(mainThread)
    } else {
        mainThread = setInterval(function(){
            live()
        }, 100);
    }
    gameRunning = !gameRunning
    const element = gameRunning ? '<div class="stop"></div><div class="stop"></div>' : '<div class="play"></div>'
    replaceElementHtml('play-game', element)

}
const resetGame = () => {
    WORLD = generateWorld(70, 70, WORLD_SEED)
    drawMatrix(WORLD)
}

const showGridAction = () => {
    showGrid = !showGrid
}

function handleMouseDown(e) {
    var mouseX = parseInt(e.clientX - canvas.offsetLeft);
    var mouseY = parseInt(e.clientY - canvas.offsetTop);
    var matrixX = Math.trunc(mouseX / PIXEL_SIZE)
    var matrixY = Math.trunc(mouseY / PIXEL_SIZE)

    WORLD[matrixY][matrixX] = 1
    drawMatrix(WORLD)

}
canvas.addEventListener("mousedown", (e) => handleMouseDown(e))
document.getElementById("show-grid").addEventListener("click", showGridAction);
document.getElementById("play-game").addEventListener("click", playGame);
document.getElementById("reset-game").addEventListener("click", resetGame);