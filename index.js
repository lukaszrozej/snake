/* global rxjs, SnakeGame, config */

const { RIGHT, LEFT, UP, DOWN, equal, start, restart, addAction, togglePause, move, newState } = SnakeGame()

const { fromEvent, interval, merge } = rxjs
const { filter, map, scan, startWith } = rxjs.operators

const width = config.cols * config.squareSize
const height = config.rows * config.squareSize

const $canvas = document.querySelector('canvas')
$canvas.width = width
$canvas.height = height
const ctx = $canvas.getContext('2d')

const $message = document.querySelector('.message')
const $h = document.querySelector('h1')
const $p = document.querySelector('p')

let previousHead = {}

const showMessage = (main, additional) => {
  $message.classList.remove('hidden')
  $h.textContent = main
  $p.textContent = additional
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

  const x = point => point.x * config.squareSize
  const y = point => point.y * config.squareSize

  // Clear
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  // Apple
  ctx.fillStyle = 'red'
  ctx.fillRect(x(state.apple), y(state.apple), config.squareSize, config.squareSize)

  // Snake
  ctx.fillStyle = 'green'
  state.snake.forEach(segment => ctx.fillRect(x(segment), y(segment), config.squareSize, config.squareSize))
}

const keyMapping = {
  13: restart,
  32: togglePause,
  37: addAction(LEFT),
  38: addAction(UP),
  39: addAction(RIGHT),
  40: addAction(DOWN)
}

const keyboardActions = fromEvent(document, 'keydown')
  .pipe(
    filter(e => keyMapping[e.keyCode]),
    map(e => keyMapping[e.keyCode])
  )

const timeTicks = interval(config.timeBetweenMoves)
  .pipe(map(() => move))

const actions = merge(keyboardActions, timeTicks)

const initialState = start(config)
const gameStates = actions.pipe(
  scan(newState, initialState),
  startWith(initialState)
)

gameStates.forEach(draw)
