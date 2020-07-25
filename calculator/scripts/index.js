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

const isOperator = (c) => ["+", "-", "*", "/"].includes(c);

const isDigit = (c) => (c >= "0" && c <= "9");

const getDisplayContent = () => document.querySelector('.display').textContent;

const defaultDisplayFontSize = getComputedStyle(document.querySelector('.display')).fontSize;
const minDisplayFontSizeInPx = 20;

// From https://stackoverflow.com/a/21015393
const getTextWidth = (text, font) => {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

// Checks whether new text fits in display with minimum font size
const newTextFits = (newVal) => {
    const div = document.querySelector('.display');
    let s = getComputedStyle(div);
    let textWidth = getTextWidth(newVal, `${minDisplayFontSizeInPx}px ${s.fontFamily}`);
    return (textWidth + 10 < div.clientWidth);
}

const setDisplayContent = (val) => {
    const div = document.querySelector('.display');
    div.textContent = val;
    div.style.fontSize = defaultDisplayFontSize;
    //  Adjust font size based on content
    let s = getComputedStyle(div)
    let textWidth = getTextWidth(div.textContent, `${s.fontSize} ${s.fontFamily}`)
    while (textWidth + 10 >= div.clientWidth) {
        div.style.fontSize = `${parseFloat(s.fontSize.replace("px", "")) - 1}px`
        s = getComputedStyle(div)
        textWidth = getTextWidth(div.textContent, `${s.fontSize} ${s.fontFamily}`)
    }
}

let operatorAllowed = false;
let lastNumber = "";
let tokens = [];
const errorStr = 'Error';

const handleInput = (val) => {
    let display = getDisplayContent();
    if (display === errorStr) {
        setDisplayContent("")
    }
    if (val === "C" || val === "c") {
        operatorAllowed = false;
        setDisplayContent("");
        lastNumber = "";
        tokens = [];
    } else if (val === "DEL" || val === "Delete") {
        let lastChar = getDisplayContent().substring(getDisplayContent().length - 1);
        if (tokens.length === 0 && (lastNumber.length == 2 || lastNumber.length == 1) && lastNumber.charAt(0) === "-") {
            operatorAllowed = false;
            lastNumber = "";
            setDisplayContent("");
        } else {
            if (isOperator(lastChar) && tokens.length > 0) {
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
            setDisplayContent(getDisplayContent().substring(0, getDisplayContent().length - 1));
        }
    } else if (isDigit(val) && newTextFits(getDisplayContent() + val)){
        setDisplayContent(getDisplayContent() + val);
        operatorAllowed = true;
        lastNumber += val;
    } else if (val === "." && operatorAllowed && lastNumber.length > 0 && !lastNumber.includes(".")
               && newTextFits(getDisplayContent() + val)) {
        setDisplayContent(getDisplayContent() + val);
        lastNumber += val;
    } else if (!operatorAllowed && val === "-") {
        if (tokens.length === 0 && lastNumber.length === 0  && newTextFits(getDisplayContent() + val)) {
            setDisplayContent(getDisplayContent() + val);
            lastNumber += val;
        }
    } else if (isOperator(val) && operatorAllowed && newTextFits(getDisplayContent() + val)) {
        setDisplayContent(getDisplayContent() + val);
        tokens.push(lastNumber);
        tokens.push(val);
        lastNumber = "";
        operatorAllowed = false;    
    } else if (val === "=" && operatorAllowed && tokens.length > 1) {
        let tokensFinal = tokens.concat(lastNumber);
        let result = operate(tokensFinal[1], tokensFinal[0], tokensFinal[2]);
        for (let i = 3; i < tokensFinal.length; i+=2) {
            result = operate(tokensFinal[i], result, tokensFinal[i + 1]);
        }
        if (isNaN(result) || !isFinite(result)) {
            lastNumber = "";
            setDisplayContent(errorStr);
            operatorAllowed = false;
        } else {
            operatorAllowed = true;
            lastNumber = `${result}`;
            setDisplayContent(`${result}`);    
        }
        tokens = [];
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