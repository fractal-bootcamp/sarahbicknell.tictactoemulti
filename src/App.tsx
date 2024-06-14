import './App.css'
import { useState, useEffect } from 'react'
import {Board, checkWinCondition} from './games'
import pawImage from './assets/paw.png'
import tankImage from './assets/tank.png'

type SquareProps = {
  value: string,
  onSquareClick: ()=>void
}

function Square({value, onSquareClick}:SquareProps) {


  let displayValue; 
  if (value === "X"){
    displayValue = <img src={tankImage} alt="X" className="icon" />
  } else if (value === "O") {
    displayValue = <img src={pawImage} alt="O" className="icon" />;
  }

  return (
    <button className="square" onClick={onSquareClick} > {displayValue} </button> 
  )
}
// interface ResetButtonProps {
//   onResetClick: () => void
// }

function ResetButton({onResetClick}) {
  return (
    <button className="reset" onClick={onResetClick} > Reset </button>
  )
}


// we need to beable to get the game to the server
const serverPath = "http://localhost:4000"

const resetGame = async (id: string) => {
  const response = await fetch(`${serverPath}/game/${id}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();
  return json;
};

const getGame = async (id: string) => {
  const response = await fetch(`${serverPath}/game/${id}`)
  const json = await response.json(); 
  return json;
}

const makeAMove = async (id: string, squareIndex:number) => {
  const response = await fetch(`${serverPath}/game/${id}/move`, {
    method: "POST",
    body: JSON.stringify({square: squareIndex}),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const json = await response.json(); 
  return json
}

//in the lobby, when you create a game you should store the id, and if you join also store id


// const initialBoard:Board = Array(9).fill("")


export default function GameBoard() {
  // const [nextPlayer, setNextPlayer] = useState(true)
  // const [squares, setSquares] = useState(initialBoard)
  const gameId = "12345"
  const [game, setGame] = useState(null);
  const [poller, setPoller] = useState(0);

  // this i think is supposed to referesh the page so the other players data renders 
  useEffect(() => {
    const initializeGame = async () => {
      // Go get the game
      const data = await getGame(gameId);
      // store the game in state
      setGame(data.game);
    };

    // call the function
    initializeGame();

    // polling
    setTimeout(() => {
      setPoller(poller + 1);
    }, 1000);
  }, [poller]);

  
  const handleSquareClick = async (index) => {
    if (game.board[index] || game.winState.winner) {
      return;
    }
    const updatedGame = await makeAMove(gameId, index);
    setGame(updatedGame.game);
  };

  const handleReset = async () => {
    const updatedGame = await resetGame(gameId);
    setGame(updatedGame.game);
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  let status;
  if (game.winState.winner) {
    status = `Winner: ${game.winState.winner}`;
  } else {
    status = `Next Player: ${game.currentPlayer}`;
  }



  // function handleClick(i: number) { 
  //   if (squares[i] || winner) {
  //     return
  //   }
  //   else {
  //     const nextSquares = squares.slice();
  //     if (nextPlayer) {
  //     nextSquares[i] = "X" ;
  //     } else {
  //     nextSquares[i] = "O";
  //     }
  //     setNextPlayer(!nextPlayer)
  //     setSquares(nextSquares) }
  // }

  // const winState = checkWinCondition({board: squares})
  // const winner = winState.winner
  // let winnerName;
  // if (winner == "X"){
  //   winnerName = "Tank"
  // } else if (winner == "O") {
  //   winnerName = "Toe"
  // }
  // let status; 
  // if (winner) {
  //   status = (winnerName=="Tank"? "🎉🪖" : "🎉😼" ) + winnerName + " wins!" + (winnerName=="Tank"? "🪖🎉" : "😼🎉" )
  // } else if (winState.outcome == "draw") {
  //   status = "💥😾Git gud noobs!😾💥"
  // } else {
  //   //i should update this to be more clear probably 
  //   status = (nextPlayer ? "Tank" : "Toe") + " goes next" + (nextPlayer? "🪖" : "😼" )
  // }
  
return (
    <div>
      <div>
        <button onClick={() => getGame("12345")}>Get Game</button>
        {JSON.stringify(game)}
      </div>
      {/* <div>
        {game?.board.map((square, index) => (
                <button
                  key={index}
                  className="square"
                  onClick={() => makeAMove(gameId, index)}
                >
                  {square} 1
                </button>
              ))}
      </div> */}
              
        <div className="game"> 
          <div className="status"> {status} </div>
            <div className="board-row">
              <Square value={game.board[0]} onSquareClick={() => handleSquareClick(0)} /> 
              <Square value={game.board[1]} onSquareClick={() => handleSquareClick(1)}/> 
              <Square value={game.board[2]} onSquareClick={() => handleSquareClick(2)}/> 
            </div> 
            <div className="board-row"> 
              <Square value={game.board[3]} onSquareClick={() => handleSquareClick(3)}/> 
              <Square value={game.board[4]} onSquareClick={() => handleSquareClick(4)}/> 
              <Square value={game.board[5]} onSquareClick={() => handleSquareClick(5)}/> 
            </div> 
            <div className="board-row"> 
              <Square value={game.board[6]} onSquareClick={() => handleSquareClick(6)}/> 
              <Square value={game.board[7]} onSquareClick={() => handleSquareClick(7)}/> 
              <Square value={game.board[8]} onSquareClick={() => handleSquareClick(8)}/> 
            </div>
          <div> 
            <ResetButton onResetClick={handleReset} /> 
          </div>  
      </div>
    </div>
  )
}
    //  <div className="page">
    //   <div className="game">
    //     <h1 className="title "> Pink Tank Toe !</h1>
    //     <div className="status"> {status} </div>
    //     <div>
    //       <div className="board-row">
    //         <Square value={squares[0]} onSquareClick={() => handleClick(0)} /> 
    //         <Square value={squares[1]} onSquareClick={() => handleClick(1)}/> 
    //         <Square value={squares[2]} onSquareClick={() => handleClick(2)}/> 
    //       </div> 
    //       <div className="board-row"> 
    //         <Square value={squares[3]} onSquareClick={() => handleClick(3)}/> 
    //         <Square value={squares[4]} onSquareClick={() => handleClick(4)}/> 
    //         <Square value={squares[5]} onSquareClick={() => handleClick(5)}/> 
    //       </div> 
    //       <div className="board-row"> 
    //         <Square value={squares[6]} onSquareClick={() => handleClick(6)}/> 
    //         <Square value={squares[7]} onSquareClick={() => handleClick(7)}/> 
    //         <Square value={squares[8]} onSquareClick={() => handleClick(8)}/> 
            
    //       </div>
    //     </div>
    //       <ResetButton onResetClick={resetGame} /> 
    //   </div>
    // </div>
    // </> 
  