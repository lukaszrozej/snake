import { RIGHT, LEFT, UP, DOWN, initialState, equal, head } from './game-logic.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let previousHead = {}

const draw = state => {
  if (equal(previousHead, head(state))) return

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
draw(initialState)