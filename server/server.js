const express = require('express');
const bodyParser = require('body-parser');
const PORT = 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('app is running on port: ', PORT);
})

let calculatorHistory = []; //storage for the user's previous calculations

app.delete('/delete', (req, res) => {
    calculatorHistory = [];
    res.sendStatus(200);
}) //process to delete display history

app.get('/history', (req, res) => {
    res.send(calculatorHistory); //GET historical calculations for client
});

app.post('/calculate', (req, res) => {
    let calculatorInput = req.body;
    let solution = {
        answer: undefined
    }; //object to be sent back to client

    let numOneFinal = Number(calculatorInput.negativeNumOne + calculatorInput.numOne); //append negative value to first number, if it exists
    let numTwoFinal = Number(calculatorInput.negativeNumTwo + calculatorInput.numTwo); //append negative value to second number, if it exists

    if (calculatorInput.operator === '+') {
        solution.answer = numOneFinal + numTwoFinal; //if operator is '+', do addition
    } else if (calculatorInput.operator === '-') {
        solution.answer = numOneFinal - numTwoFinal; //if operator is '-', do subtraction
    } else if (calculatorInput.operator === '*') {
        solution.answer = numOneFinal * numTwoFinal; //if operator is '*', do multiplication
    } else if (calculatorInput.operator === '/') {
        solution.answer = numOneFinal / numTwoFinal; //if operator is '/', do division
    }

    solution.answer = Math.round(1000 * solution.answer) / 1000;
    console.log(solution.answer); //round for display purposes


    let historyUpdate = {
        historicalNumOne: numOneFinal,
        historicalOperator: calculatorInput.operator,
        historicalNumTwo: numTwoFinal,
        historicalSolution: solution.answer
    } //declare values for historical GET requests

    calculatorHistory.push(historyUpdate);  //push this calculation into the history

    res.send(solution); //send answer back to client
})