import React, { useState } from "react";
// eslint-disable-next-line 
function Square({ value, onSquareClick }) {

  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  )
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  console.log(squares)
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function Board({ xNext, squares, onplay }) {
  //const [squares,setSquares] = useState(Array(9).fill(null));
  //const [xNext, setXNext] =useState(true);
  // eslint-disable-next-line 
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const newSquare = squares.slice();
    if (xNext) {
      newSquare[i] = 'X';
    } else {
      newSquare[i] = 'O';
    }
    onplay(newSquare);
    //setSquares(newSquare);
    // setXNext(!xNext);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'winner:' + winner;
  } else {
    status = 'next player:' + (xNext ? 'X' : 'O');
  }

  function renderBoard() {
    const board = [];
    const len = squares.length;
    console.log("ll", len)
    for (let i = 0; i < len; i=i+3) {
      console.log(i, len);
      const rowSquare = [];
      for (let j = i; j < i+3; j++) {
        console.log("jj",j)
        rowSquare.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)}></Square>);
      }
      board.push(<div className="board-row">{rowSquare}</div>);
    }
    return board;
  }
  const board = [];
  const len = squares.length;
  console.log("ll", len)
  for (let i = 0; i < len; i = i + 3) {
    console.log(i, len);
    const rowSquare = [];
    for (let j = i; j < i + 3; j++) {
      console.log("jj", j)
      rowSquare.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)}></Square>);
    }
    board.push(<div className="board-row">{rowSquare}</div>);
  }
  return (
    <React.Fragment>
      <div className="status">{status}</div>
      {renderBoard()}
    </React.Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //const [xNext, setXNext] =useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const xNext = currentMove % 2 === 0;
  const currentSquare = history[currentMove];
  console.log('ccc', currentSquare)

  function handlePlay(newSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquare];
    setHistory(nextHistory);
    //setXNext(!xNext);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //setXNext(nextMove %2 ===0);
  }

  const moves = history.map((square, move) => {
    let description;
    if (move <= 0) {
      description = 'Go to game start';
    } else if (move === currentMove) {
      description = 'You are at move #' + move;
    } else {
      description = 'Go to move #' + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });
  //console.log('mm',moves)
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquare} onplay={handlePlay} xNext={xNext}></Board>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>

  );
}
