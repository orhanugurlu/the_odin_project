const Board = (function() {
    
    let handler;
    let boardStatus = new BoardStatus();

    const handleClick = (e) => {
        let coords = e.target.getAttribute('id')
            .replace('cell', '')
            .split('_')
            .map(e => Number(e));
        if (handler) {
            handler(coords[0], coords[1]);
        }
    }

    const createGridCell = (row, col) => {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.style.gridColumnStart = col;
        div.style.gridColumnEnd = col + 1;
        div.style.gridRowStart = row;
        div.style.gridRowEnd = row + 1;
        div.setAttribute('id', `cell${row}_${col}`);
        div.addEventListener('click', handleClick);
        return div;
    }

    const removeAllCells = (gameBoardElm) => {
        gameBoardElm.querySelectorAll('.cell').forEach(e => e.parentNode.removeChild(e));
    }

    const createAndAddAllCells = (gameBoardElm) => {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                let cellElm = createGridCell(row, col);
                gameBoardElm.appendChild(cellElm);
            }
        }
    }

    const reset = () => {
        let gameBoardElm = document.querySelector('#gameboard');
        removeAllCells(gameBoardElm);
        createAndAddAllCells(gameBoardElm);
        boardStatus = new BoardStatus();
    };

    reset();

    const hightlightCells = (cells) => {
        cells.forEach(cell =>{
            document.querySelector(`#cell${cell.row}_${cell.col}`).style.color = 'red';
        })
    }

    const setCell = (row, col, value) => {
        let winningCells = boardStatus.setCell(row, col, value);
        document.querySelector(`#cell${row}_${col}`).textContent = value;
        if (winningCells) {
            hightlightCells (winningCells)
        }
    }

    const getCell = (row, col) => {
        return boardStatus.getCell(row, col);
    }

    const setCellClickHandler = (newHandler) => {
        handler = newHandler;
    }

    const getStatus = () => {
        return boardStatus.getStatus();
    }

    const isFinished = () => {
        return boardStatus.isFinished();
    }

    const getNextEasyMove = () => {
        let row = Math.floor(Math.random() * BOARD_SIZE); 
        let col = Math.floor(Math.random() * BOARD_SIZE);
        while (boardStatus.getCell(row, col) !== EMPTY_CELL) {
            row = Math.floor(Math.random() * BOARD_SIZE); 
            col = Math.floor(Math.random() * BOARD_SIZE);    
        }
        return {row, col};
    }

    const miniMax = (boardStatus, isMaximizing) => {
        if (boardStatus.isFinished()) {
            let status = boardStatus.getStatus();
            return status === SECOND_PLAYER ? 1 : (status === FIRST_PLAYER ? -1 : 0);
        }
        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (boardStatus.getCell(row, col) === EMPTY_CELL) {
                    boardStatus.setCell(row, col, isMaximizing ? SECOND_PLAYER : FIRST_PLAYER);
                    let score = miniMax(boardStatus, !isMaximizing);
                    boardStatus.setCell(row, col, EMPTY_CELL);
                    bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }

    const getNextHardMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (boardStatus.getCell(row, col) === EMPTY_CELL) {
                    boardStatus.setCell(row, col, SECOND_PLAYER);
                    let score = miniMax(boardStatus, false);
                    boardStatus.setCell(row, col, EMPTY_CELL);
                    if (score > bestScore) {
                        bestScore = score;
                        move = {row, col}
                    }
                }
            }
        }
        return move;
    }  

    return {
      reset,
      setCell,
      getCell,
      setCellClickHandler,
      getStatus,
      isFinished,
      getNextEasyMove,
      getNextHardMove
    }
  })();
