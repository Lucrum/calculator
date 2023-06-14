import { operate } from "./operations.js";

let operator;
let left;
let right;
let waiting = false;
let autoCalc = true;

let displayStr = '0';

const buttonList = document.querySelectorAll('#number');
const operatorList = document.querySelectorAll('#operation');
const equalsButton = document.querySelector('#equal');
const display = document.querySelector('.display');
const clearButtons = document.querySelectorAll('#clear');


updateDisplay();

[...buttonList].forEach((button) => 
    button.addEventListener('click', addNumber));
[...operatorList].forEach((button) => 
    button.addEventListener('click', addOperator));
[...clearButtons].forEach((button) =>
    button.dataset.clearType === 'all' ? 
    button.addEventListener('click', allClear) :
    button.addEventListener('click', clear));
equalsButton.addEventListener('click', equals);

function addNumber(event) {

    if (displayStr == '0' || left) {
        displayStr = event.target.dataset.number;
    } else {
        displayStr += event.target.dataset.number;
    }

    waiting = false;
    
    updateDisplay();
};

function updateDisplay() {
    display.textContent = displayStr;
};

function clear() {
    console.log("shallowclear");
    displayStr = '0';
    right = null;
    waiting = true; // ?
    updateDisplay();
};

function allClear() {
    console.log("full clear");
    displayStr = '0';
    operator = null;
    left = null;
    right = null;
    waiting = true;
    autoCalc = true;
    updateDisplay();
}

function addOperator(event) {
    // if there is no left num, store it
    // if there is a left num, perform operation on that with curr num
    // then store curr num as left
    let newOperator = event.target.dataset.operator;
    console.log(left, right, operator, newOperator);

    if (newOperator === '-/+') {
        // negation operator, just negate the display
        displayStr = +displayStr * (-1);
        left = +displayStr;
        updateDisplay();
        return;
    }

    if (left && operator) {
        // operate left with prev operator and curr number
        right = null;
        if (autoCalc) {
            console.log("operating", left, displayStr, operator);
            equals();
            autoCalc = true;
        } else {
            console.log("will not auto calculate");
        }
        

    } else if (left) {
        // store operator (left from previous operation)
    } else {
        console.log("storing display")
        
        left = +displayStr;
    }

    waiting = true;
    operator = newOperator;
    updateDisplay();
}

function equals() {
    console.log(left, right, operator, waiting);

    if (waiting) {
        // do nothing
        console.log("Waiting for input!!!");
    } else {
        if (left && operator && right) {
            console.log("drawing from last op");
            left = operate(left, right, operator);
            displayStr = left;
        } else if (left && operator) {
            console.log("drawing from display");
            right = +displayStr;
            left = operate(left, +displayStr, operator);
            displayStr = left;
        }
        autoCalc = false;
    }
    
    updateDisplay();
}