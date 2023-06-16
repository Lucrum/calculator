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

// init buttons and event listeners
const buttonList = document.querySelectorAll('#num-op');
const display = document.querySelector('.display');
const clearButtons = document.querySelectorAll('#clear');


[...buttonList].forEach((button) => 
    button.addEventListener('click', (event) => {
        handleInput(event.target.dataset.val);
    }));
[...clearButtons].forEach((button) =>
    button.dataset.clearType === 'all' ? 
    button.addEventListener('click', allClear) :
    button.addEventListener('click', shallowClear));

window.addEventListener('keydown', (event) => {
    handleInput(event.key);
});

function handleInput(key) {
    // console.log("pressed", key);
    const numbers = ['1','2','3','4','5','6','7','8','9','0'];
    const operations = ['/', '+', '-', '*', '-/+'];
    if (numbers.includes(key)) {
        addNumber(key);
    } else if (operations.includes(key)) {
        addOperator(key);
    } else if (key === "Escape") {
        allClear();
    } else if (key === "Backspace") {
        shallowClear();
    } else if (key === '.') {
        addDecimal();
    } else if (key === "Enter") {
        resolve();
    }
}

updateDisplay();

function addNumber(num) {

    if (displayStr === '0' || weakDisplay) {
        displayStr = num;
        weakDisplay = false;
    } else {
        displayStr += num;
    }
    repeatable = false;
    updateDisplay();
};

function addDecimal() {
    if (displayStr == '0') {
        displayStr = '0.';
    } else if (!displayStr.includes('.')) {
        displayStr += '.';
    }
    weakDisplay = false;
    updateDisplay();
};

function updateDisplay() {
    display.textContent = displayStr;
};

function shallowClear() {
    // console.log("shallowclear");
    displayStr = '0';
    right = null;
    updateDisplay();
};

function allClear() {
    // console.log("full clear");
    displayStr = '0';
    operator = null;
    left = null;
    right = null;
    stage = 0;
    updateDisplay();
}

function addOperator(newOperator) {
    // if there is no left num, store it
    // if there is a left num, perform operation on that with curr num
    // then store curr num as left
    // console.log(left, right, operator, newOperator);
    repeatable = false;
    if (newOperator === '-/+') {
        // negation operator, just negate the display
        displayStr = +displayStr * (-1);
        left = +displayStr;
        updateDisplay();
        return;
    }
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
        // console.log("drawing from last op");
        left = operate(left, right, operator);
        displayStr = left;
    } else if (left && operator) {
        calculateFromDisplay();
    }
    
    stage = 0;
    updateDisplay();
}

function calculateFromDisplay() {
    // console.log("drawing from display");
    right = +displayStr;
    left = operate(left, +displayStr, operator);
    displayStr = left;
    repeatable = true;
    weakDisplay = true;
}