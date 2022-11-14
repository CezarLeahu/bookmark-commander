import { useReducer } from 'react'
import './Game.css'

type SquareState = 'X' | '0' | undefined

interface BoardState {
  readonly player: SquareState
  readonly winner: SquareState
  readonly cells: SquareState[]
}

interface Action {
  readonly index?: number
  readonly reset?: boolean
}

const reducer = (state: BoardState, action: Action): BoardState => {
  console.log(`[reduce...] (${String(action.index)} ${String(action.reset?.toString())})`)

  if (action.reset === true) {
    console.log('[reduce... done] (reset)')
    return {
      player: 'X',
      winner: undefined,
      cells: Array<SquareState>(9).fill(undefined),
    }
  }

  if (action.index === undefined) {
    throw Error('Missing action.index value')
  }

  if (state.winner !== undefined) {
    console.log('Game already finished')
    return state
  }

  if (state.cells[action.index] !== undefined) {
    console.log('Box already used')
    return state
  }

  const cells = [...state.cells]
  cells[action.index] = state.player
  return {
    player: state.player === 'X' ? '0' : 'X',
    winner: gameCompleted(cells) ? state.player : undefined,
    cells,
  }
}

function gameCompleted(vals: SquareState[]): boolean {
  return (
    (vals[0] !== undefined && vals[0] === vals[1] && vals[1] === vals[2]) ||
    (vals[3] !== undefined && vals[3] === vals[4] && vals[4] === vals[5]) ||
    (vals[6] !== undefined && vals[6] === vals[7] && vals[7] === vals[8]) ||
    (vals[0] !== undefined && vals[0] === vals[3] && vals[3] === vals[6]) ||
    (vals[1] !== undefined && vals[1] === vals[4] && vals[4] === vals[7]) ||
    (vals[2] !== undefined && vals[2] === vals[5] && vals[5] === vals[8]) ||
    (vals[0] !== undefined && vals[0] === vals[4] && vals[4] === vals[8]) ||
    (vals[2] !== undefined && vals[2] === vals[4] && vals[4] === vals[6])
  )
}

const Board = (): JSX.Element => {
  const [state, dispatch] = useReducer(
    reducer,
    {
      player: 'X',
      winner: undefined,
      cells: Array<SquareState>(9).fill(undefined),
    },
    initial => initial,
  )

  console.log(`${state.cells.toString()} | ${state.player ?? ''} |  ${state.winner ?? ''}`)

  const message =
    state.winner === undefined
      ? `Next player: ${state.player ?? ''}`
      : `${state.winner ?? ''} is the winner`

  const squares = state.cells.map<JSX.Element>((v, i) => (
    <button key={i} className='square' onClick={() => dispatch({ index: i })}>
      {v}
    </button>
  ))

  return (
    <div>
      <div className='status'> {message} </div>
      <div className='board-row'>
        <> {squares.slice(0, 3)} </>
      </div>
      <div className='board-row'>
        <> {squares.slice(3, 6)} </>
      </div>
      <div className='board-row'>
        <> {squares.slice(6, 9)} </>
      </div>
      <button className='status' onClick={() => dispatch({ reset: true })}>
        Reset
      </button>
    </div>
  )
}

const Game = (): JSX.Element => {
  return (
    <div className='game'>
      <div className='game-board'>
        <Board />
      </div>
      <div className='game-info'>
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  )
}

export default Game
