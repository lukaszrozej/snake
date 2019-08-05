/* global rxjs, SnakeGame */

const { RIGHT, LEFT, UP, DOWN, RESTART, initialState, equal, newState } = SnakeGame()

const { fromEvent, interval, animationFrameScheduler, merge } = rxjs
const { filter, map, scan } = rxjs.operators

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const message = document.querySelector('.message')

let previousHead = {}

const draw = state => {
  if (state.gameOver) {
    message.classList.remove('hidden')
  } else {
    message.classList.add('hidden')
  }

  if (equal(previousHead)(state.snake[0])) return

  previousHead = state.snake[0]

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
