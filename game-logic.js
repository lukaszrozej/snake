/* eslint-disable no-unused-vars */
const SnakeGame = () => {
/* eslint-eneble no-unused-vars */
  const RIGHT = { x: 1, y: 0 }
  const LEFT = { x: -1, y: 0 }
  const DOWN = { x: 0, y: 1 }
  const UP = { x: 0, y: -1 }
  const RESTART = 'restart'
  const TOGGLE_PAUSE = 'toggle_pause'

  const initialState = {
    rows: 30,
    cols: 40,
    snake: [{ x: 20, y: 15 }],
    actions: [],
    direction: RIGHT,
    timeOfLastMove: 0,
    timeBetweenMoves: 100,
    apple: { x: 10, y: 15 },
    applesEaten: 0,
    eating: false,
    growing: 0,
    growthPerApple: 5,
    gameOver: false,
    paused: false
  }

  const equal = p1 => p2 => p1.x === p2.x && p1.y === p2.y
  const opposite = (p1, p2) => p1.x === -p2.x && p1.y === -p2.y
  const add = (p1, p2) => ({
    x: p1.x + p2.x,
    y: p1.y + p2.y
  })

  const addAction = (state, action) => {
    if (state.paused) return state

    const nextState = {
      actions: state.actions.concat(action)
    }
    return { ...state, ...nextState }
  }

  const randomApple = (rows, cols, snake) => {
    let apple = snake[0]
    while (snake.find(equal(apple))) {
      apple = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      }
    }
    return apple
  }

  const move = state => {
    if (state.gameOver || state.paused) return state

    const actions = state.actions.slice(1)
    const direction = state.actions.length === 0 || opposite(state.direction, state.actions[0])
      ? state.direction
      : state.actions[0]

    const head = add(state.snake[0], direction)
    const tail = state.growing
      ? state.snake
      : state.snake.slice(0, -1)

    const gameOver =
    head.x < 0 ||
    head.x >= state.cols ||
    head.y < 0 ||
    head.y >= state.rows ||
    tail.find(equal(head))

    const snake = gameOver
      ? state.snake
      : [head].concat(tail)

    const apple = state.eating
      ? randomApple(state.rows, state.cols, snake)
      : state.apple

    const eating = equal(head)(state.apple)

    const growing =
    (state.growing ? state.growing - 1 : 0) +
    (state.eating ? state.growthPerApple : 0)

    const nextState = {
      snake,
      actions,
      direction,
      apple,
      eating,
      growing,
      gameOver
    }

    return { ...state, ...nextState }
  }

  const togglePause = state =>
    state.paused
      ? { ...state, ...{ paused: false } }
      : { ...state, ...{ paused: true } }

  const newState = (state, action) => {
    switch (action) {
      case RESTART: return initialState
      case LEFT:
      case RIGHT:
      case UP:
      case DOWN: return addAction(state, action)
      case TOGGLE_PAUSE: return togglePause(state)
      default: return move(state)
    }
  }

  return { RIGHT, LEFT, UP, DOWN, RESTART, TOGGLE_PAUSE, initialState, equal, newState }
}
