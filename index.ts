import {Board, checkWinCondition} from './src/games'

const gameBoard = [
    'X', 'X', 'X',
    '', '', '',
    '', '', '',
  ] satisfies Board;

const testWin = [
    'X', 'X', 'X',
    'O', 'O', 'X',
    'X', 'O', 'O',
  ] satisfies Board;

const drawBoard = [
    'X', 'X', 'O',
    'O', 'O', 'X',
    'X', 'O', 'O',
  ] satisfies Board;

const winState = checkWinCondition({board: gameBoard})

console.log(winState)