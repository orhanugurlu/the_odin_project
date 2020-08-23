const Controller = (function() {

    const GAME_MODE_2_PLAYER  = '2 Player';
    const GAME_MODE_COMP_EASY = 'AI Easy';
    const GAME_MODE_COMP_HARD = 'AI Hard';
    const gameModes = [GAME_MODE_2_PLAYER, GAME_MODE_COMP_EASY, GAME_MODE_COMP_HARD];
    let gameMode = GAME_MODE_2_PLAYER;
    let players = [new Player('Player 1', FIRST_PLAYER), new Player('Player 2', SECOND_PLAYER)]
    let currPlayerIdx = 0;

    const setMessage = (msg) => {
        document.querySelector('#message').innerHTML = msg
        document.querySelector('#gameboard').style.opacity = msg === '' ? '1.0' : '0.25';
        document.querySelector('#message_container').style.visibility = msg === '' ? 'none' : 'visible';
        document.querySelector('#message_container').style.zIndex = msg === '' ? -1 : 10;
    }

    const setControlsEnabled = (enabled) => {
        players[0].setEnabled(enabled);
        players[1].setEnabled(enabled);
        document.querySelector('#game_type').disabled = !enabled;
    }

    const restartRound = () => {
        Board.reset();
        currPlayerIdx = 0;
        players[currPlayerIdx].setActive(true);
        players[currPlayerIdx + 1 % 2].setActive(false);
        setControlsEnabled(true);
        setMessage('');
    }

    const isComputerTurn = () => {
        return (currPlayerIdx === 1 && gameMode !== GAME_MODE_2_PLAYER);    
    }

    const handleBoardClick = (row, col, isComputer=false) => {
        if (!Board.isFinished() && (isComputerTurn() === isComputer)) {
            setControlsEnabled(false);
            if (Board.getCell(row, col) === EMPTY_CELL) {
                Board.setCell(row, col, players[currPlayerIdx].role);
                players[currPlayerIdx].setActive(false);
                if (!Board.isFinished()) {
                    currPlayerIdx = (currPlayerIdx + 1) % 2;
                    players[currPlayerIdx].setActive(true);
                    if (currPlayerIdx === 1 && gameMode !== GAME_MODE_2_PLAYER) {
                        let move = (gameMode === GAME_MODE_COMP_EASY ? Board.getNextEasyMove() : Board.getNextHardMove());
                        setTimeout(() => {
                            handleBoardClick (move.row, move.col, true);
                        }, 1000);
                    }
                } else {
                    setControlsEnabled(true);
                    if (Board.getStatus() === EMPTY_CELL) {
                        setMessage('Tie!');    
                    } else {
                        setMessage(`${players[currPlayerIdx].name}<br>Won!`);    
                        players[currPlayerIdx].setScore(players[currPlayerIdx].score + 1);              
                    }
                    players[currPlayerIdx].setActive(false);
                }
            }    
        }
    }

    const handleNewGame = () => {
        players[0].setScore(0);
        players[1].setScore(0);
        restartRound();
    }

    const handleNewRound = () => {
        restartRound();
    }

    const handleGameTypeChange = (e) => {
        if (e.target.value !== GAME_MODE_2_PLAYER) {
            players[1].setName('Computer');
        } else {
            players[1].setName('');
        }
        gameMode = e.target.value;
        handleNewGame();
    }

    const start = () => {
        setMessage('');
        gameModes.forEach((option, key) => {
            document.querySelector('#game_type')[key] = new Option(option, option);
        });
        Board.setCellClickHandler(handleBoardClick);
        document.querySelector('#new_round').addEventListener('click', handleNewRound);
        document.querySelector('#new_game').addEventListener('click', handleNewGame);
        document.querySelector('#game_type').addEventListener('change', handleGameTypeChange);
        players[currPlayerIdx].setActive(true);
    }

    return {
      start
    }
})();

Controller.start();
