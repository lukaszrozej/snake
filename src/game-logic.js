const RIGHT = { x: 1, y: 0 }
const LEFT = { x: -1, y: 0 }
const DOWN = { x: 0, y: 1 }
const UP = { x: 0, y: -1 }

const initialState = {
  rows: 30,
  cols: 40,
  snake: [{ x: 20, y: 15 }, { x: 21, y: 15 }],
  moves: [RIGHT],
  apple: { x: 10, y: 15 },
  lastMoveTime: 0,
  applesEaten: 0,
  gameOver: false
}

export { RIGHT, LEFT, UP, DOWN, initialState }
