import React, { useState,useEffect } from "react";
// eslint-disable-next-line 

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
  // console.log(squares)
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }

  return null;
}
function Square({ value, onSquareClick, winner }) {
  //console.log('square value', value)
  //console.log("winner", winner)
  return (
    <button className={winner ? 'square win' : 'square'} onClick={onSquareClick}>{value}</button>
  )
}
function Board({ xNext, squares, onplay }) {
  //const [squares,setSquares] = useState(Array(9).fill(null));
  //const [xNext, setXNext] =useState(true)；
  const [winner, setWinner] = useState(null);
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
    const calWinner = calculateWinner(newSquare);
    if (calWinner) {
      setWinner(calWinner);
    }
    onplay(newSquare);
    //setSquares(newSquare);
    // setXNext(!xNext);
  }
  
  let status;
  if (winner && winner.length > 0) {
    //console.log('winner1', winner)
    status = 'winner:' + squares[winner[0]];
  } else if (!winner && !squares.includes(null)){
    status = 'It is a draw!'
  }
  else {
    status = 'next player:' + (xNext ? 'X' : 'O');
  }


  function renderBoard() {
    const board = [];
    const len = squares.length;
    // console.log("ll", len)
    for (let i = 0; i < len; i = i + 3) {
      //console.log(i, len);
      const rowSquare = [];
      for (let j = i; j < i + 3; j++) {
        //console.log("jj", j)
        rowSquare.push(<Square key={j} winner={winner && winner.includes(j)} value={squares[j]} onSquareClick={() => handleClick(j)}></Square>);
      }
      board.push(<div className="board-row" key={i}>{rowSquare}</div>);
    }
    // console.log(board);
    return board;
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
  const [sortAscending, setSortAscending] = useState(true);
  const [moves, setMoves] = useState(getMoves(history));//usestate里可以放异步函数吗？？
  console.log('currentsquare',currentSquare)
  /*在函数组件中定义变量（没有使用useState）如 currentSquare,这种变量会随着定义它的变量的变化而变化，
  这可以想象成大函数里的变量随着相关的变量变化而重新又执行了一遍.如：history利用setHistory()发生了变化，对应的currentsquare也会变化
  而currentsquare是作为board函数组件的参数进行传递，因此board组件也会re-render

  而getMoves()方法是定义在函数中的函数，有自己的独立的一块作用域，他可以访问上一级函数的变量，但是它访问的currentMove不一定就是最新更新的
  数据，因此需要用useEffect来进行观测数据变化

  **/
  function getMoves(his) {
    console.log('getmoves', his,currentMove)
    return his.map((square, move) => {
      let description;
      if (move <= 0) {
        description = 'Go to game start';
      } else if (move === currentMove) {
        description = 'You are at move #' + move;
      } else {
        description = 'Go to move #' + move;
      }
      return {
        id: move,
        name: description
      }
    });
  }
  function toggleMoves() {
    const sortMove = [...moves].sort((a, b) => {
      if (sortAscending) {
        return a.id - b.id
      } else {
        return b.id - a.id
      }
    });
    setMoves(sortMove);
    console.log('move', moves)

  }
  function toggleSortOder() {
    setSortAscending(!sortAscending);
  }

  function handlePlay(newSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquare];
    //console.log("newss", newSquare,nextHistory)
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setMoves(getMoves(nextHistory));

    console.log('nxh', history, currentMove, moves, getMoves(nextHistory))

  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    console.log('nx',nextMove)
    //setXNext(nextMove %2 ===0);
  }

  useEffect(() => {
    setMoves(getMoves(history));
  }, [currentMove])
  
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquare} onplay={handlePlay} xNext={xNext}></Board>
      </div>
      <div className="game-info">
        <button onClick={toggleSortOder}>toggle sort order:{sortAscending ? 'Ascending' : 'Descending'}</button>
        <button onClick={toggleMoves}>Sort Moves</button>
        <ol>{moves.map((move) => (
          <li key={move.id}>
            <button onClick={() => jumpTo(move.id)}>{move.name}</button>
          </li>
        ))}</ol>
      </div>
    </div>

  );
}
