import { RIGHT, LEFT, UP, DOWN, RESTART, initialState, equal, head, newState } from './game-logic.js'

import { fromEvent, interval, animationFrameScheduler, merge } from 'rxjs'
import { filter, map, scan } from 'rxjs/operators'


const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let previousHead = {}

const draw = state => {
  if (equal(previousHead)(head(state))) return

  previousHead = head(state)

  const sizeX = Math.round(canvas.width / state.cols)
  const sizeY = Math.round(canvas.height / state.rows)

  const x = point => point.x * sizeX
  const y = point => point.y * sizeY

  // Clear
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Apple
  ctx.fillStyle = 'red'
  ctx.fillRect(x(state.apple), y(state.apple), sizeX, sizeY)

  // Snake
  ctx.fillStyle = 'green'
  state.snake.forEach(segment => ctx.fillRect(x(segment), y(segment), sizeX, sizeY))
}

draw(initialState)

const keyMapping = {
  32: RESTART,
  37: LEFT,
  38: UP,
  39: RIGHT,
  40: DOWN
}

const keyboardActions = fromEvent(document, 'keydown')
  .pipe(
    filter(e => keyMapping[e.keyCode]),
    map(e => keyMapping[e.keyCode])
  )

const timeTicks = interval(0, animationFrameScheduler)
  .pipe(map(() => Date.now()))

const actions = merge(keyboardActions, timeTicks)

const gameStates = actions.pipe(scan(newState, initialState))

gameStates.forEach(draw)