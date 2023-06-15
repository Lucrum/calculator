import { operate } from "./operations.js";

let operator;
let left;
let right;

/*
stage 0 when waiting for a left number (switch on operator)
stage 1 when waiting for a right number
stage 2 when all fields are fulfilled
*/

let stage = 0;

let displayStr = '0';
let weakDisplay = false;
let repeatable = false;

const buttonList = document.querySelectorAll('#number');
const operatorList = document.querySelectorAll('#operation');
const equalsButton = document.querySelector('#equal');
const display = document.querySelector('.display');
const clearButtons = document.querySelectorAll('#clear');
const decimalButton = document.querySelector('#decimal');


updateDisplay();

[...buttonList].forEach((button) => 
    button.addEventListener('click', addNumber));
[...operatorList].forEach((button) => 
    button.addEventListener('click', addOperator));
[...clearButtons].forEach((button) =>
    button.dataset.clearType === 'all' ? 
    button.addEventListener('click', allClear) :
    button.addEventListener('click', clear));
equalsButton.addEventListener('click', resolve);
decimalButton.addEventListener('click', addDecimal);

function addNumber(event) {

    if (displayStr === '0' || weakDisplay) {
        console.log("hehe")
        displayStr = event.target.dataset.number;
        weakDisplay = false;
    } else {
        displayStr += event.target.dataset.number;
    }
    repeatable = false;
    updateDisplay();
};

function addDecimal(event) {
    if (displayStr == '0') {
        displayStr = '0.';
    } else if (displayStr % 1 == 0) {
        displayStr += event.target.dataset.number;
    }
    updateDisplay();
};

function updateDisplay() {
    display.textContent = displayStr;
};

function clear() {
    console.log("shallowclear");
    displayStr = '0';
    right = null;
    updateDisplay();
};

function allClear() {
    console.log("full clear");
    displayStr = '0';
    operator = null;
    left = null;
    right = null;
    stage = 0;
    updateDisplay();
}

function addOperator(event) {
    // if there is no left num, store it
    // if there is a left num, perform operation on that with curr num
    // then store curr num as left
    let newOperator = event.target.dataset.operator;
    console.log(left, right, operator, newOperator);
    repeatable = false;
    if (newOperator === '-/+') {
        // negation operator, just negate the display
        displayStr = +displayStr * (-1);
        left = +displayStr;
        updateDisplay();
        return;
    }

    console.log(stage);
    switch (stage) {
        case 0:
            left = +displayStr;
            stage++;
            weakDisplay = true;
            break;
        case 1:
            right = +displayStr;
            calculateFromDisplay();
            break;
    }

    operator = newOperator;
    updateDisplay();
}

function resolve() {

    if (repeatable) {
        console.log("drawing from last op");
        left = operate(left, right, operator);
        displayStr = left;
    } else if (left && operator) {
        calculateFromDisplay();
    }
    
    stage = 0;
    updateDisplay();
}

function calculateFromDisplay() {
    console.log("drawing from display");
    right = +displayStr;
    left = operate(left, +displayStr, operator);
    displayStr = left;
    repeatable = true;
    weakDisplay = true;
}