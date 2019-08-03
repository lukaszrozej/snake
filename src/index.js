import { RIGHT, LEFT, UP, DOWN, initialState } from './game-logic.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const draw = state => {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

draw(initialState)