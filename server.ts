import express from "express";
import cors from "cors";
const bodyParser = require('body-parser');
const app = express();

//json handling
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

export type Board = string[]

type Game = {
    board: Board
}

export type WinCondition = {
    outcome: 'win' | 'draw' | null,
    winner?: String 
}

type MaybeWinningPosition = number[]

export function checkWinCondition(game: Game): WinCondition{

    //possible winning positions on the board
    const possibleWinPositions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7,], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]
    //evaluates if the board at that possible win position is a winner, if so it returns the first item in that position(so we can know if 
    //winner is x or o)
    function checkIfWinner(possibleWinPosition: MaybeWinningPosition) {
        const firstItem = game.board[possibleWinPosition[0]]
        const secondItem = game.board[possibleWinPosition[1]]
        const thirdItem = game.board[possibleWinPosition[2]]

        if (firstItem && firstItem === secondItem && secondItem === thirdItem) {
            console.log(firstItem)
            return firstItem
            } return "";
        } 

    // now , i want to check whether any of these possible positions on the actual board are winners
    for(let i = 0; i < possibleWinPositions.length; i++) {
        // calls a function to evaluate if the board at that possible win position is filled in, and if so assigns it as the winner 
        const winner = checkIfWinner(possibleWinPositions[i])
        // checks that winner isnt an empty string and if so returns the outcome of WIN 
        if (winner !== "") {
            return { outcome: 'win', winner }
        }
    }
    // if no winner found , check if it's a draw 
    const areThereAnySpaces = game.board.includes("")
    const isDraw = !areThereAnySpaces;
    if (isDraw) {
        return { outcome: 'draw' }
    }
    // if not full and no winner, keep playing
    return { outcome: null }
} 

//INITIALIZE BOARD
const emptyBoard = ["", "", "", "", "", "", "", "", ""];

// HARDCODED GAME FOR TESTING 
let games: { [key: string]: Game } = {
 ["12345"]:{
    gameId: "12345",
    board: [...emptyBoard],
    currentPlayer: "X", 
    player1: {token: "X", id: ""},
    player2: {token: "O", id: ""},
    winState: {outcome: null, winner: null}
 }
}

//GET FOR BASIC ROUTE 
app.get('/', (req, res) => {
    res.send("hi hoes")
})

//get a game by ID as a parameter
app.get('/game/:id', (req, res) => {
    // assign id to the url parameter 
    const id = req.params.id;
    // get specific game by ID
    const game = games[id];

    // if no game found
    if (!game) {
        return res.status(404).send("game not found")
    }
    //send json of the game object
    res.json({game: game})

})

//POST request for making a move in the game 
app.post('/game/:id/move', (req, res) => {
    const id = req.params.id;
    const game = games[id];

    //variable holds the index of the square clicked 
    const squareIndex = req.body.square;

    // if no game found
    if (!game) {
        return res.status(404).send("game not found")
    }

    // Check if the move is valid
    if (game.board[squareIndex] || game.winState.winner) {
        return res.status(400).send("invalid move");
    }

    //sets new board and switches current player 
    const newBoard = game.board.slice(); 
    const player = game.currentPlayer
    newBoard[squareIndex] = player; 
    game.currentPlayer = player === "X" ? "O" : "X"
    game.board = newBoard

    const winCondition = checkWinCondition(game)
    game.winState = winCondition

    //returns game json object
    res.json({game})

})

app.post('/game/:id/reset', (req, res) => { 
    const id = req.params.id; 
    const game = games[id];

    game.board = [...emptyBoard]
    game.currentPlayer = "X";
    game.winState = {outcome: null, winner: null}


    res.json({game})


})

//runs the server on port 4000 
app.listen(4000, () => {
    console.log("listening on port 4000")

})