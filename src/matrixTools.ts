// @ts-nocheck

export const walkMatrix = (matrix, callback) => {
  matrix.forEach((row, y) => row.forEach((pixel, x) =>{
    callback(y,x,pixel)
  }))
}

export const generateMatrix = (width, height, seed:[]) => {
  var newWorld = [];
  for(var i=0; i<width; i++) {
      newWorld[i]=[]
    for(var j=0; j<height; j++) {
      newWorld[i][j] = 0
    }
  }

  if (seed) {
    const smallMatrix = width > seed.length ? seed : newWorld
    walkMatrix(smallMatrix, (y,x) => {
      newWorld[y][x] = seed[y][x]
    })
  }
  return newWorld
}