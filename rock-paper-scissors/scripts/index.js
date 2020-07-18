const ROCK = 'Rock';
const PAPER = 'Paper';
const SCISSORS = 'Scissors';
let playerScore = 0;
let computerScore = 0;

function computerPlay() {
    let newSelection = Math.floor(Math.random()*3)
    return newSelection === 0 ? ROCK : (newSelection === 1 ? PAPER : SCISSORS)
}

const updateCase = (str) => str.charAt(0).toUpperCase() + str.substring(1)

function getResultStr (hasWinned, winPlay, losePlay) {
    return `You ${hasWinned ? 'won' : 'lost'} the round! ${winPlay} beats ${losePlay}.`
}

function playRound(playerSelection, computerSelection) {
    let playerSel = updateCase(playerSelection)
    let computerSel = updateCase(computerSelection)

    if (playerSel === computerSel) {
        return `Tie this round, both are ${playerSel}`
    } else if (playerSel === ROCK) {
        if (computerSel === SCISSORS) {
            return getResultStr(true, playerSel, computerSel)
        } else {
            return getResultStr(false, computerSel, playerSel)
        }
    } else if (playerSel === PAPER) {
        if (computerSel === ROCK) {
            return getResultStr(true, playerSel, computerSel)
        } else {
            return getResultStr(false, computerSel, playerSel)
        }
    } else if (playerSel === SCISSORS) {
        if (computerSel === PAPER) {
            return getResultStr(true, playerSel, computerSel)
        } else {
            return getResultStr(false, computerSel, playerSel)
        }
    }
}

const handleButtonClick = (e) => {
    if (computerScore === 5 || playerScore === 5) {
        computerScore = 0;
        playerScore = 0;
    }
    let result = playRound(e.target.id, computerPlay());
    if (result.includes('won')) playerScore++;
    if (result.includes('lost')) computerScore++;
    if (computerScore === 5) {
        result += " <b>Computer won the game.</b>"
    } else if (playerScore === 5) {
        result += " <b>You won the game.</b>"
    }
    document.querySelector('.message').innerHTML = result;
    document.querySelector('#score-user').textContent = `${playerScore}`
    document.querySelector('#score-computer').textContent = `${computerScore}`
}

document.querySelectorAll('button').forEach((element) => element.addEventListener('click', handleButtonClick))
