import { useEffect, useState } from 'react';

function Square({value, onSquareClick, classNameForPlayer}) {
  return (
    <button className="square" onClick={onSquareClick}>
      <div className={classNameForPlayer}>{value}</div>
    </button>
  );
}

function LineOfSquare({lineNo, qtyColumns, classNameForPlayers, squares, handleClick}) {
  return (
      <>
        {(() => {
              let initialIndex = lineNo * qtyColumns;
              let lastIndex = ((lineNo + 1) * qtyColumns) - 1;    
              let lineContent = []; 
              for(let j = initialIndex; j <= lastIndex; j++) {
                lineContent.push(<Square key={j} classNameForPlayer={classNameForPlayers[j]} value={squares[j]} onSquareClick={() => handleClick(j)} />
                );
              }
              return lineContent;
            }
          )()}
      </>
      ); 
 }

function TableOfSquare({qtyLines, qtyColumns, classNameForPlayers, squares, handleClick}) {  
  return (
        <>
          {(() => {
            let tableContent = [];
            for(let i = 0; i < qtyLines; i++) {
              tableContent.push(
              <div key={i} className="board-row">
                <LineOfSquare lineNo={i} qtyColumns={qtyColumns} classNameForPlayers={classNameForPlayers} squares={squares} handleClick={handleClick} />
              </div>);
            }
            return tableContent;
          })()}
        </>
        );      
}

function Board({xIsNext, squares, onPlay, qtyLines, qtyColumns, firstPlayer, secondPlayer, qtySquaresForWin}) {
  let classForFirstPlayer = "class-for-first-player", 
  classForSecondPlayer = "class-for-second-player", 
  classForWinner = "class-for-winner";
  const[classNameForPlayers, setClassNameForPlayers] = useState(Array(qtyLines*qtyColumns).fill(null));  
  
  let allLinesForWinner = tableOfLinesForWinner(qtyLines, qtyColumns, qtySquaresForWin);

  const lineWinner = calculateWinner(squares, allLinesForWinner);
  let winner;
  if(lineWinner) {
    for(let i=0; i<lineWinner.length; i++) {
      classNameForPlayers[lineWinner[i]] = classForWinner;
    }
    winner = squares[lineWinner[lineWinner.length-1]];
  } else {
    for(let i=0; i<qtyLines*qtyColumns; i++) {
      if(squares[i]) {
        if(squares[i] === firstPlayer) {
          classNameForPlayers[i] = classForFirstPlayer;
        } else {
          classNameForPlayers[i] = classForSecondPlayer;
        }
      }
    }
  }
  let status;
  if(winner) {
    status = "Game over and the Winner is : \""+winner+"\"";
  } else {
    status = "The player \""+(xIsNext ? firstPlayer : secondPlayer)+"\" must play now.";
  }

  function handleClick(i) { 
    if(lineWinner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = firstPlayer;
      classNameForPlayers[i] = classForFirstPlayer;
    } else {
      nextSquares[i] = secondPlayer;
      classNameForPlayers[i] = classForSecondPlayer;
    }
    onPlay(nextSquares);
    setClassNameForPlayers(classNameForPlayers);
  }

  return (
  <>
    <div className="status">{status}</div>
    <TableOfSquare qtyLines={qtyLines} qtyColumns={qtyColumns} classNameForPlayers={classNameForPlayers} squares={squares} handleClick={handleClick} />
  </>
  );
}

export default function Game() {

  let isMobile = window.innerWidth < 768;
  let initialQtyColumn = isMobile ? 5 : 10;

  const[qtyOfLines, setQtyOfLines] = useState(10);
  const[qtyOfColumns, setQtyOfColumns] = useState(initialQtyColumn);
  const[qtyOfSquaresForWin, setQtyOfSquaresForWin] = useState(5);
  const[firstPlayerName, setFirstPlayerName] = useState('FP');
  const[secondPlayerName, setSecondPlayerName] = useState('SP');

  const[qtyLines, setQtyLines] = useState(10);
  const[qtyColumns, setQtyColumns] = useState(initialQtyColumn);
  const[qtySquaresForWin, setQtySquaresForWin] = useState(5);
  const[firstPlayer, setFirstPlayer] = useState('FP');
  const[secondPlayer, setSecondPlayer] = useState('SP');

  const[isGameActive, setIsGameActive] = useState(false);

  const validateGame = () => {
    let msg = validateSettings(qtyOfLines, qtyOfColumns, qtyOfSquaresForWin, firstPlayerName, secondPlayerName, isMobile);
    if(!isGameActive){
      if(msg === null) {
        setQtyLines(parseInt(qtyOfLines));
        setQtyColumns(parseInt(qtyOfColumns));
        setQtySquaresForWin(parseInt(qtyOfSquaresForWin));
        setFirstPlayer(firstPlayerName);
        setSecondPlayer(secondPlayerName);

        document.getElementById("lines").disabled = true;
        document.getElementById("columns").disabled = true;
        document.getElementById("squares-to-win").disabled = true;
        document.getElementById("first-player-name").disabled = true;
        document.getElementById("second-player-name").disabled = true;
        setIsGameActive(true);
        if(isMobile) {
          document.getElementById("setting-details").style.display = "none";
          document.getElementById("setting-button").addEventListener("click", function() {
            document.getElementById("setting-details").style.display = "block";
          });
        }
      } else {
        alert(msg);
      }
    } else {
      document.getElementById("lines").disabled = false;
      document.getElementById("columns").disabled = false;
      document.getElementById("squares-to-win").disabled = false;
      document.getElementById("first-player-name").disabled = false;
      document.getElementById("second-player-name").disabled = false;
      setIsGameActive(false);
      document.getElementById("setting-details").style.display = "block";
    }
  }

  function validateSettings(qtyOfLines, qtyOfColumns, qtyOfSquaresForWin, firstPlayerName, secondPlayerName, isMobile) {
    
    if(!qtyOfLines || qtyOfLines < 3 || qtyOfLines > 50) {
      return 'Set a valid number of lines. \n'+
      'The number of lines must be between 3 and 50.';
    }
    if(!isMobile) {
      if(!qtyOfColumns || qtyOfColumns < 3 || qtyOfColumns > 12) {
        return 'Set a valid number of columns. \n'+
        'For the computer or tablet the number of columns must be between 3 and 12.';
      }
    } else {
      if(!qtyOfColumns || qtyOfColumns < 3 || qtyOfColumns > 5) {
        return 'Set a valid number of columns. \n'+
        'For a mobile phone the number of columns must be between 3 and 5.';
      }
    }
    if(!qtyOfSquaresForWin || qtyOfSquaresForWin < 3 || qtyOfSquaresForWin > 10) {
      return 'Set a valid number squares to line up for a victory. \n'+
      'The number of squares to line up for a victory must be between 3 and 10.';
    }
    if(qtyOfSquaresForWin > qtyOfLines || qtyOfSquaresForWin > qtyOfColumns) {
      return 'Set a valid number squares to line up for a victory. \n'+
      'The number of squares to line up for a victory must be smaller than the number of lines and the number of columns.';
    }
    if(!firstPlayerName || firstPlayerName.length < 1 || firstPlayerName.length > 3 ) {
      return 'Set a valid the name for the first player. \n'+
      'The name of the first player must be one character, two character or three characters.';
    }
    if(!secondPlayerName || secondPlayerName.length < 1 || secondPlayerName.length > 3 ) {
      return 'Set a valid the name for the second player. \n'+
      'The name of the second player must be one character, two character or three characters.';
    }
    return null;
  }

  function Settings() {
    let labelButton = 'Start a new Game';
    if(isGameActive) {
      labelButton = 'Edit settings';
    } 
    return (<div className='setting aside'>
      <div id='setting-details'>
        <h2>
          Settings
        </h2>
        <div>
          <label className='setting-label'>Number of lines</label>
          <input className='setting-field' type="text" placeholder='Enter the number of lines' id='lines' maxLength="2" value={qtyOfLines} onChange={(e) => {setQtyOfLines(e.target.value);} }></input>
        </div>
        <div>
          <label className='setting-label'>Number of Columns</label>
          <input className='setting-field' type="text" placeholder='Enter the number of columns' id='columns' maxLength="2" value={qtyOfColumns} onChange={(e) => setQtyOfColumns(e.target.value)}></input>
        </div>
        <div>
          <label className='setting-label'>Number of Squares to win</label>
          <input className='setting-field' type="text" placeholder='Enter the number of squares to win' id='squares-to-win' maxLength="1" value={qtyOfSquaresForWin} onChange={(e) => setQtyOfSquaresForWin(e.target.value)}></input>
        </div>
        <div>
          <label className='setting-label'>Name of the first player</label>
          <input className='setting-field' type="text" placeholder='Enter the name of the first player' id='first-player-name' maxLength="3" value={firstPlayerName} onChange={(e) => setFirstPlayerName(e.target.value)}></input>
        </div>
        <div>
          <label className='setting-label'>Name of the second player</label>
          <input className='setting-field' type="text" placeholder='Enter the name of the second player' id='second-player-name' maxLength="3" value={secondPlayerName} onChange={(e) => setSecondPlayerName(e.target.value)}></input>
        </div>
      </div>
      <div id='setting-button'>
          <button className='normal-button' onClick={validateGame}>{labelButton}</button>
      </div>
    </div>);
  }

  const [history, setHistory] = useState([Array(qtyLines*qtyColumns).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [allMovesToDisplay, setAllMovesToDisplay] = useState([]);
  const [historyOrderAscendant, setHistoryOrderAscendant] = useState(true);
  const [isJumpToHistory, setIsJumpToHistory] = useState(false);
  const [isJumpToStart, setIsJumpToStart] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const moves = history.map((squares, move) => {
    let description = 'Go to move #'+(move+1);
    if(history.length - 1 === move) {
      return <li key={move+1}>You are at move #{move+1}</li>
    }
    return (
      <li key={move+1}>
        <button  className='very-small-button' onClick={() => jumpTo(move+1)}>{description}</button>
      </li>
    );
  });

  function handlePlay(nextSquares) {
    if(isGameActive) {
      const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      if(isJumpToHistory) {      
        for(let i = moves.length-1; i>currentMove; i--) {
          moves.pop();
        }
        let lastMove = moves.pop();
        moves.push(<li key={lastMove.key}>You are at move #{lastMove.key}</li>);
      }
      setIsJumpToStart(false);
      setIsJumpToHistory(false);
      refreshMovesToDisplay();
    } else {
      alert('Validate the settings by clicking the START NEW GAME button before continue.');
    }
  }

  function jumpTo(nextMove) {
    if(nextMove === 0) {
      moves.pop();
      setIsJumpToStart(true);
      setCurrentMove(0);
    } else {
      setCurrentMove(nextMove);
    }
    let lastMove = moves.pop();
    moves.push(<li key={lastMove.key}><button className='very-small-button' onClick={() => jumpTo(lastMove.key)}>{"Go to move #"+lastMove.key}</button></li>);    
    setIsJumpToHistory(true);
    refreshMovesToDisplay();
  }


  function sortHistory(isJumpToHistory) { 
    //alert(isJumpToHistory);
      moves.pop(); //remove the last move from the array moves
      let lastMove = moves.pop(); //remove the before last move from the array moves and store it in the variable lastMove
    if(!isJumpToHistory) {      
      moves.push(<li key={lastMove.key}>You are at move #{lastMove.key}</li>);
    } else {
      moves.push(<li key={lastMove.key}><button onClick={() => jumpTo(lastMove.key)}>{"Go to move #"+lastMove.key}</button></li>); 
    }
    if(historyOrderAscendant) {
      setAllMovesToDisplay(moves.toReversed());
      setHistoryOrderAscendant(false);
    } else {
      setAllMovesToDisplay(moves.toSorted());
      setHistoryOrderAscendant(true);
    }
    
  }

  function refreshMovesToDisplay(){
    if(historyOrderAscendant) {
      setAllMovesToDisplay(moves.toSorted());
    } else {
      setAllMovesToDisplay(moves.toReversed());
    }
  }

  function ButtonByType({type}) {
    if(currentMove > 0 || isJumpToStart) {
      if(type == 'start-btn') {
        return (<button className='small-button' onClick={() => jumpTo(0)}>{"Go back to the beginning"}</button>);
      } 
      if(type == 'sort-hist') {
        return (<button className='small-button' onClick={() => sortHistory(isJumpToHistory)}>Sort History</button>);
      }
    }
    return null;
  }

  return (
    <div>
      <div className="header">
        <h1>Tic-Tac-Toe Game</h1>
      </div>
      <div className="row">
        <div className='col-3 col-s-12'>
          {Settings()}
        </div>
        <div className="col-6 col-s-9">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} qtySquaresForWin={qtySquaresForWin}
            qtyLines={qtyLines} qtyColumns={qtyColumns} firstPlayer={firstPlayer} secondPlayer={secondPlayer}
          />     
          <div>   
              <ButtonByType type='start-btn' />
          </div>
        </div>
        <div className="col-3 col-s-3 menu">
          <div>
            <ButtonByType type='sort-hist' />
          </div>
          <ol>
            {allMovesToDisplay}
          </ol>
        </div> 
      </div>
    </div>
  )
}

function tableOfLinesForWinner(qtyLines, qtyColumns, qtySquaresForWin) {
  let qtyMin = qtyLines > qtyColumns ? qtyColumns : qtyLines;
  let qtyMax = qtyLines > qtyColumns ? qtyLines : qtyColumns;
  let copyLines = [];
  let m = 0;
  //console.log(qtyLines, qtyColumns, qtySquaresForWin);
  //For lines
  for(let i = 0; i < qtyLines; i++) {
    let limitj = qtyColumns * (i+1) - qtySquaresForWin; 
    for(let j = i * qtyColumns; j <= limitj; j++) {
      let copyElements = [];
      for(let k=0; k < qtySquaresForWin; k++) {
        copyElements[k] = j+k; 
      }
      if(copyElements.length == qtySquaresForWin) { 
        copyLines[m++] = copyElements; 
      }
    } 
  }
  //console.log(copyLines); 
  //For columns 
  for(let i = 0; i < qtyColumns; i++) { 
    let limitj = (qtyLines-1)*qtyColumns+i - qtyColumns*(qtySquaresForWin-1);
    for(let j = i; j <= limitj; j+=qtyColumns) {
      let copyElements = []; 
      for(let k=0; k < qtySquaresForWin; k++) {
        copyElements[k] = j+(k*qtyColumns); 
      }
      if(copyElements.length == qtySquaresForWin) {
        copyLines[m++] = copyElements;
      }
    }
  }
//For diagonals referencies lines (qtyColumns < qtyLines)  
  for(let i = 0; i+(qtySquaresForWin-1) < qtyLines; i++) {
    //Haut-Gauche vers Bas-Droite en balayant du haut vers le bas
    let limitj = (qtyColumns * qtyLines - i) - ((qtySquaresForWin-1)*(qtyColumns+1));
    for(let j = i * qtyColumns; j <= limitj; j+=(qtyColumns+1)) {
      let copyElements = [];
      let limitk =  qtyLines >= qtyColumns ? ((qtyColumns + i) * qtyColumns - j) / (qtyColumns+1) : ((qtyColumns - 1) * qtyLines - i - j) / (qtyColumns+1);
      for(let k=0; k<qtySquaresForWin && k < limitk; k++) {
       copyElements[k] = j+k*(qtyColumns+1);  
      }
      
      if(copyElements.length == qtySquaresForWin) {
        copyLines[m++] = copyElements; 
      }

    }
    
    //Haut-Droite vers Bas-Gauche en balayant du haut vers le bas
    let initial = qtyColumns * (i + 1)-1;
    limitj = (qtyLines > qtyColumns ? (qtyColumns - 1 + i)*qtyColumns : (qtyColumns - 1) * qtyLines + i)  - ((qtyColumns - 1)*(qtySquaresForWin-1));
    for(let j = initial; j <= limitj; j+=(qtyColumns-1)) {
      let copyElements = [];
      let limitk = qtyLines > qtyColumns ? ((qtyColumns-1 + i) * qtyColumns - j)/(qtyColumns-1) : ((qtyColumns-1) * qtyLines + i - j)/(qtyColumns-1);
      for(let k=0; k<qtySquaresForWin && k <= limitk; k++) {
        copyElements[k] = j+k*(qtyColumns-1);
      }
      if(copyElements.length == qtySquaresForWin) {
        copyLines[m++] = copyElements; 
      }
    }
  }

  //For diagonals referencies columns (qtyLines < qtyColumns)
  for(let i = 1; i+(qtySquaresForWin-1) < qtyColumns; i++) {
    //Haut-Gauche vers Bas-Droite en balayant de la gauche vers la droite
    let limitj = qtyColumns*(qtyLines > qtyColumns ? qtyColumns : qtyLines) + i - ((qtySquaresForWin-1)*(qtyColumns+1));
    for(let j = i; j <= limitj; j+=(qtyColumns+1)) {
      let copyElements = [];
      let limitk = qtyLines > qtyColumns ? (qtyColumns*(qtyColumns-i) - j) / (qtyColumns+1) : (qtyColumns*(qtyColumns-1) + i - j) / (qtyColumns+1);
      for(let k=0; k<qtySquaresForWin && k<limitk; k++) {
       copyElements[k] = j+k*(qtyColumns+1); 
      }
      if(copyElements.length == qtySquaresForWin) {
        copyLines[m++] = copyElements;
      }
    }
    
    //Haut-Droite vers Bas-Gauche en balayant de la droite vers la gauche
    let initial = qtyColumns - 1 - i;
    limitj = ((qtyColumns) * (qtyColumns - 1 - i)) - ((qtyColumns - 1)*(qtySquaresForWin-1));
    for(let j = initial; j <= limitj; j+=(qtyColumns-1)) {
      let copyElements = [];
      let limitk = qtyLines > qtyColumns ? (qtyColumns*(qtyColumns-1 - i) - j) / (qtyColumns - 1) : (qtyColumns*(qtyColumns-1) - i - j) / (qtyColumns - 1);
      for(let k=0; k<qtySquaresForWin && k <= limitk; k++) {
        copyElements[k] = j+k*(qtyColumns-1);
      }
      if(copyElements.length == qtySquaresForWin) {
        copyLines[m++] = copyElements;
      }
    }    
  }
  return copyLines;
}

function calculateWinner(squares, allLinesForWinner) {
  for(let i= 0; i < allLinesForWinner.length; i++) {
    let currentLine = allLinesForWinner[i];
    let count = 0;
    for(let j=0; j<currentLine.length; j++) {
      if(squares[currentLine[0]] && squares[currentLine[0]] === squares[currentLine[j]]) {
        count++;
      }
    }
    if(count === currentLine.length) {
      return currentLine; 
    }
  }
  return null;
}

