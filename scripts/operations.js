export function operate(a, b, operator) {
    // console.log(a, operator, b);
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            if (b === 0) {
                return "Stop that!!";
            }
            return divide(a, b);
        case '^':
            return raise(a, b);
        case '%':
            return modulo(a, b);
        default:
            return null;
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

// will not accept b = 0
function divide(a, b) {
    return a / b;
}

function raise(a, b) {
    return Math.pow(a, b);
}

function modulo(a, b) {
    return a % b;
}

