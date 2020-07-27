// @ts-nocheck
import { walkMatrix } from './matrixTools'

const PIXEL_SIZE = 10
let showGrid = true
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


const drawPixel = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(PIXEL_SIZE*x, PIXEL_SIZE*y, PIXEL_SIZE, PIXEL_SIZE);
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

export const drawMatrix = (matrix) => {
  walkMatrix(matrix, (y,x,pixel) =>{
    const isAlive = pixel === 1
    const color = isAlive ? "black" : "white"
    drawPixel(x,y,color)
  })
  showGrid && drawGrid(matrix)
}

export const flikerMatrix = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}