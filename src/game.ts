
const calculateNeighborsAlive = (matrix: number[][], center:number[]) => {
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

export const recalculateLife = (matrix: number[][]) => {
  
  const matrixHeight = matrix.length - 1
  const matrixWidth = matrix[0].length - 1

  const newMatrix = matrix.map((row, y) => row.map((pixel, x) => {
      const isBorder = x === 0 || y === 0 || x === matrixWidth || y === matrixHeight
      if(!isBorder) {
          const isAlive = pixel === 1
          const neighborsAlive = calculateNeighborsAlive(matrix, [y,x])

          if(isAlive){
              const hasTwoNeighbors = neighborsAlive == 2 || neighborsAlive == 3
              const justDie = !hasTwoNeighbors

              if(justDie) {
                  return 0
              }
          } else {
              const hasThreeNeighbors = neighborsAlive == 3
              const beBorn = hasThreeNeighbors

              if(beBorn) {
                  return 1
              }
          }
          return pixel
      }
  }))

  return newMatrix
}