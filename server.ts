import express from "express";
import cors from "cors";

const app = express();

//json handling
app.use(express.json());
app.use(cors())

const emptyBoard = ["", "", "", "", "", "", "", "", ""];


let games = {
 ["12345"]:{
    gameId: "12345",
    board: emptyBoard,
    currentPlayer: "X", 
    player1: {token: "x", id: ""},
    player2: {token: "x", id: ""},
    winState: {outcome: null, winner: null}
 }
}

app.get('/', (req, res) => {
    res.send("hi hoes")
})

app.get('/game/:id', (req, res) => {
    const id = req.params.id;
    const game = games[id];

    // if no game found
    if (!game) {
        return res.status(404).send("game not found")
    }

    res.json({game: game})

})

app.post('/game/:id/move', (req, res) => {
    const id = req.params.id;
    const game = games[id];

    const {index} = req.body

    // if no game found
    if (!game) {
        return res.status(404).send("game not found")
    }

    const newBoard = game.board; 
    const player = game.currentPlayer
    newBoard[index] = player; 
    game.currentPlayer = player === "x" ? "o" : "x"

})

app.listen(4000, () => {
    console.log("listening on port 4000")

})