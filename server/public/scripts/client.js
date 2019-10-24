$(document).ready(handleReady);

function handleReady() {
    $('.button-num').on('click', acceptValue);  //allow input from calculator buttons
    $('#button-clear').on('click', clearInput); //clear calculator
    $('#button-undo').on('click', undoInput); //undo last input
    $('#button-equals').on('click', equals); //POST - parse the inputs, send to server and do math
    $('#button-clearHistory').on('click', deleteHistory);  //DELETE - clears calculation history with DELETE method
    $('#myAlert').on('click', '.close', removeAlert); //allows for removal of any alert messages
    getHistory(); //GET - retrieve historical calculations
}

let userEntry = []; //hold each user input in an array

function removeAlert() {
    $(this).closest('div').remove();
} //function to remove alert messages

function deleteHistory() {
    $.ajax({
        type: 'DELETE',
        url: '/delete',
        data: { method: 'delete' }
    }).then(function (response) {
        console.log(response);
        getHistory();
        $('#span-result').empty();
    })
}  //function to delete all stored calculations from array in the server

function undoInput() {
    userEntry.pop();
    displayEntry(userEntry);
} //undo last user input and reload input

function clearInput() {
    $('#input-number').val('');
    userEntry = [];
} //reset calculator and clear array of user inputs

function acceptValue() {
    let value = $(this).data('value'); //store button data value
    userEntry.push((value)); //add value to user input array
    displayEntry(userEntry); //show all user inputs to the user
}

function displayEntry(inputs) {
    let numberDisplay = '' //declare variable for user-friendly display
    for (let input of inputs) {
        numberDisplay += input;
    } //cycle through all values of array and create a user friendly display
    $('#input-number').val(numberDisplay);  //show display within calculator
}

function equals() {
    let parsedValue = {
        numOne: '',
        numTwo: '',
        negativeNumOne: '',
        negativeNumTwo: '',
        operator: ''
    } //object to be POSTed

    let valueToParse = $('#input-number').val();  //grab current calculator value
    let i = 0;  //set value to be used by multiple processes
    if (valueToParse[i] === '-') {
        parsedValue.negativeNumOne += valueToParse[i];
        i++;
    } //capture negative symbol for number one, if it exists

    for (i; valueToParse[i] !== '+' && valueToParse[i] !== '-' && valueToParse[i] !== '*' && valueToParse[i] !== '/' && i < valueToParse.length; i++) {
        parsedValue.numOne += valueToParse[i];
    } //set numOne to include all future integers and dots, until it hits an operator

    parsedValue.operator = valueToParse[i]; //grab the operator

    i++; //increment i, so it can begin grabbing numTwo

    let operatorCheckOne = i; // grabbing this for validation later

    if (valueToParse[i] === '-') {
        parsedValue.negativeNumTwo += valueToParse[i];
        i++;
    } //capture negative symbol for number two, if it exists

    let operatorCheckTwo = i; // grabbing this for validation later

    for (i; valueToParse[i] !== '+' && valueToParse[i] !== '-' && valueToParse[i] !== '*' && valueToParse[i] !== '/' && i < valueToParse.length; i++) {
        parsedValue.numTwo += valueToParse[i];
    } //set numTwo to include all future integers and dots

    //BEGIN VALIDATION
    let realNumOne = Number(parsedValue.numOne);
    let realNumTwo = Number(parsedValue.numTwo);

    if (parsedValue.numTwo === '') {
        $('#myAlert').append(`
        <div id="alert-missingNumberAfterMinus" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please ensure a second number is defined.
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false;
    } //helps ensure that a double minus input with no following number is not accepted by the client

    if (valueToParse[0] === '+' || valueToParse[0] === '*' || valueToParse[0] === '/' ||
        (valueToParse[0] === '-' && valueToParse[1] === '-') ||
        (valueToParse[0] === '-' && valueToParse[1] === '+') ||
        (valueToParse[0] === '-' && valueToParse[1] === '*') ||
        (valueToParse[0] === '-' && valueToParse[1] === '/')) {
        $('#myAlert').append(`
        <div id="alert-leadingOperator" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please ensure your calculation does not begin with an operator (+, -, *, or /).
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false;
    } //stops calculation if it begins with an operator

    if (parsedValue.operator === '/' && realNumTwo === 0) {
        $('#myAlert').append(`
            <div id="alert-divideByZero" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> You may not divide by 0.
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false;
    } //stops calculation when attempting to divide by 0

    if (parsedValue.operator !== '+' && parsedValue.operator !== '-' && parsedValue.operator !== '*' && parsedValue.operator !== '/') {
        $('#myAlert').append(`
            <div id="alert-missingOperator" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please check that you have an operator selected (+, -, *, or /).
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false;
    } //operator must be an operator to continue

    if (isNaN(realNumOne) === true || isNaN(realNumTwo) === true) {
        $('#myAlert').append(`
            <div id="alert-invalidNumbers" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please ensure both numbers are valid.
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false;
    } //checks that both numbers are valid

    if (valueToParse[operatorCheckOne] === '+' || valueToParse[operatorCheckOne] === '*' || valueToParse[operatorCheckOne] === '/') {
        $('#myAlert').append(`
            <div id="alert-manyOperatorsCheckOne" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please ensure you are not using more than one operator (+, -, *, or /).
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
        return false; //validation for everything except -, since we will allow for a negative number
    }

    for (let j = operatorCheckTwo; j < valueToParse.length; j++) {
        if (valueToParse[j] === '+' || valueToParse[j] === '-' || valueToParse[j] === '*' || valueToParse[j] === '/') {
            $('#myAlert').append(`
            <div id="alert-manyOperatorsCheckTwo" class="alert alert-danger alert-dismissible fade show">
            <strong>Error!</strong> Please ensure you are not using more than one operator (+, -, *, or /).
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            `);
            return false; //validation for no operators after last opportunity for a negative number
        }
    }

    //END VALIDATION
    
    $('#input-number').val(''); //clear number display
    userEntry = []; //clear array of numbers

    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: parsedValue
    }).then(function (response) {
        $('#span-result').text(response.answer);
        getHistory();
    })
} //send object to server, server will calculate, receive the solution and include it in a span.  Also, trigger GET to retrieve history.

function getHistory() {
    $.ajax({
        method: 'GET',
        url: '/history'
    }).then(function (response) {

        $('#ul-history').empty(); //empty historical display

        for (let each of response) {
            $('#ul-history').prepend(`<li>${each.historicalNumOne} ${each.historicalOperator} ${each.historicalNumTwo} = ${each.historicalSolution}</li>`); //append each historical calculation to the DOM
        } //append history following GET request
    })
}