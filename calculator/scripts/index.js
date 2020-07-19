const add = (a, b) => {
    return Number(a) + Number(b);
}

const subtract = (a, b) => {
    return Number(a) - Number(b);
}

const multiply = (a, b) => {
    return Number(a) * Number(b);
}

const divide = (a, b) => {
    return Number(a) / Number(b);
}

const functions = {
    "+" : add,
    "-" : subtract,
    "*" : multiply,
    "/" : divide,
}

const operate = (operator, a, b) => functions[operator](a, b);

const getDisplay = () => document.querySelector('.display').textContent;

const setDisplay = (val) => document.querySelector('.display').textContent = val;

const isOperator = (c) => ["+", "-", "*", "/"].includes(c);

const isDigit = (c) => (c >= "0" && c <= "9");

let dotAllowed = true;
let operatorAllowed = false;
let lastNumber = "";
let tokens = [];

const handleInput = (val) => {
    let display = getDisplay();
    if (val === "C" || val === "c") {
        dotAllowed = true;
        operatorAllowed = false;
        setDisplay("");
        lastNumber = "";
        tokens = [];
    } else if (val === "DEL" || val === "Delete") {
        let lastChar = getDisplay().substring(getDisplay().length - 1);
        if (isOperator(lastChar)) {
            operatorAllowed = true;
            tokens.pop();
            lastNumber = tokens.pop();
        } else {
            if (lastNumber.length == 1) {
                operatorAllowed = false;
                lastNumber = "";
            } else if (lastNumber.length > 1) {
                lastNumber = lastNumber.substring(0, lastNumber.length - 1);
            }
        }
        setDisplay(getDisplay().substring(0, getDisplay().length - 1));
    } else if (isDigit(val)){
        setDisplay(getDisplay() + val);
        operatorAllowed = true;
        lastNumber += val;
    } else if (val === ".") {
        //setDisplay(getDisplay() + val);
    } else if (isOperator(val)) {
        if (operatorAllowed) {
            setDisplay(getDisplay() + val);
            tokens.push(lastNumber);
            tokens.push(val);
            lastNumber = "";
            operatorAllowed = false;    
        }
    } else if (val === "=") {
        if (operatorAllowed && tokens.length > 1) {
            let tokensFinal = tokens.concat(lastNumber);
            let result = operate(tokensFinal[1], tokensFinal[0], tokensFinal[2]);
            for (let i = 3; i < tokensFinal.length; i+=2) {
                result = operate(tokensFinal[i], result, tokensFinal[i + 1]);
            }
            dotAllowed = true;
            operatorAllowed = true;
            lastNumber = `${result}`;
            tokens = [];
            setDisplay(`${result}`);
        }
    }
}

const handleButtonClick = (e) => {
    handleInput(e.target.textContent);
}

const handleKeyPress = (e) => {
    handleInput(e.key);
}

document.querySelectorAll('button').forEach((element) => element.addEventListener('click', handleButtonClick));
document.addEventListener('keypress', handleKeyPress);