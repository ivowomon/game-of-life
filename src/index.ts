import { Observable, interval, fromEvent, combineLatest, merge } from "rxjs";
import { mapTo, startWith, scan, map, throttleTime } from 'rxjs/operators';

import { recalculateLife } from './game'
import { generateMatrix } from './matrixTools'
import { drawMatrix, flikerMatrix } from './render'
import { gameControls$ } from './controls'

import './style.css'


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

gameControls$.subscribe((e)=>{
console.log("e", e)
  
})

const runningInterval$ = interval(2500)

combineLatest(runningInterval$, gameControls$).pipe(
  //throttleTime(1000),
  scan(([acc],cur) => {
    const [_, controls] = cur
    const worldSize = (controls.mapSize)* 10
    const newBoard = recalculateLife(generateMatrix(worldSize,worldSize, acc))
    return [newBoard, controls]
  },[generateMatrix(70,70,WORLD_SEED)] ),

  scan((state,cur) => {
  console.log("state,cur", state,cur)

    return cur 
  }, {}),
  map((state) => {
    const [game, controls]=state
  console.log("game, controls", game, controls)


    return state
  })
).subscribe(([game])=>drawMatrix(game))

gameControls$.subscribe(() => flikerMatrix())