import express from "express";
import cors from "cors";
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));



//json handling
app.use(express.json());
app.use(cors())

//INITIALIZE BOARD
const emptyBoard = ["", "", "", "", "", "", "", "", ""];

// HARDCODED GAME FOR TESTING 
let games = {
 ["12345"]:{
    gameId: "12345",
    board: emptyBoard,
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

    //sets new board and switches current player 
    const newBoard = game.board.slice(); 
    const player = game.currentPlayer
    newBoard[squareIndex] = player; 
    game.currentPlayer = player === "X" ? "O" : "X"
    game.board = newBoard

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
    console.log("Reset Post request: ", game)


})

//runs the server on port 4000 
app.listen(4000, () => {
    console.log("listening on port 4000")

})