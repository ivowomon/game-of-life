// @ts-nocheck

import { fromEvent, combineLatest, merge } from "rxjs"
import { scan, map, startWith, mapTo } from "rxjs/operators"

interface Controls {
  label: string;
  playGame: boolean;
  resetGame: boolean;
  mapSize: number;
  showGrid: boolean;
}

// elem refs
const CONTROLS = [
  {
    querySelector: "[data-control=play-game]",
    scanCallback:(acc) => (!acc),
    defaultValue:true,
  },
  {
    querySelector: "[data-control=reset-game]",
    scanCallback:(acc) => (!acc),
    defaultValue:true,
  },
  {
    querySelector: "[data-control=show-grid]",
    scanCallback:(acc) => (!acc),
    defaultValue:true,
  },
]

const resize$ = merge(
  fromEvent(document.querySelector("[data-control=resize-up]"), 'click').pipe(mapTo(1)),
  fromEvent(document.querySelector("[data-control=resize-down]"), 'click').pipe(mapTo(-1)),
).pipe(
  scan((acc,cur)=>((acc+cur) > 4 ? acc + cur : 4 ),4)
);

const addOneClick$ = (querySelector, scanCallback, defaultValue) =>
  fromEvent(document.querySelector(querySelector), 'click').pipe(
    scan(scanCallback, defaultValue),
    map(e=>{console.log('addOneClick',e); return e;}),
    startWith(defaultValue),
  );

const controls$ = CONTROLS.map(({
    querySelector,
    scanCallback,
    defaultValue,
  }) => (
    addOneClick$(querySelector, scanCallback, defaultValue)
  ))


export const gameControls$ = combineLatest([...controls$, resize$]).pipe(
  scan((acc, [
    playGame,
    resetGame,
    showGrid,
    mapSize,
  ]): Controls => ({
    ...acc,
    playGame,
    resetGame,
    showGrid,
    mapSize,
  }), {}),
  map(e=>{console.log('gameControls',e); return e;})
)

/*   const playGame = () => {
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
  document.getElementById("reset-game").addEventListener("click", resetGame); */