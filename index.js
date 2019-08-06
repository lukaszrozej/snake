/* global rxjs, SnakeGame */

const { RIGHT, LEFT, UP, DOWN, RESTART, TOGGLE_PAUSE, initialState, equal, newState } = SnakeGame()

const { fromEvent, interval, animationFrameScheduler, merge } = rxjs
const { filter, map, scan } = rxjs.operators

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const $message = document.querySelector('.message')
const $main = document.querySelector('.main')
const $additional = document.querySelector('.additional')

let previousHead = {}

const showMessage = (main, additional) => {
  $message.classList.remove('hidden')
  $main.textContent = main
  $additional.textContent = additional
}

const hideMessage = () => {
  $message.classList.add('hidden')
}

const draw = state => {
  if (state.paused) showMessage('PAUSED', '(press space to unpause)')
  if (state.gameOver) showMessage('GAME OVER', '(press Enter to restart)')

  if (equal(previousHead)(state.snake[0])) return

  hideMessage()

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
  13: RESTART,
  32: TOGGLE_PAUSE,
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
