## Server-Side Calculator

In this challenge, I created a calculator interface that can accept any two numbers and add, subtract, multiply or divide them.  The numbers get stored in an object on the client side, then are posted to the server for calculation.  The server sends back the result, which displays for the user on the DOM.

A few notes about approaches and enhancements to the project:

-I used the "data" method to link each button to a number or operator (., +, -, *, /).

-The equals function takes the entire user input and parses it out.  It identifies negative values and distinguishes them from the minus operator.

-Several validation checks exist to ensure numbers cannot be divided by 0, that multiple operators are not used (except for the purpose of entering a negative number), that both numbers are valid, and that there are no more than two numbers entered.

-An 'undo' button pops the last value of the array storing the calculator input.

-Values are prepended onto the DOM, and the first value stands out in a larger, bold and green font.

Screenshots:

![calculator 1](images/max-calculator-1.png)

![calculator 2](images/max-calculator-2.png)
