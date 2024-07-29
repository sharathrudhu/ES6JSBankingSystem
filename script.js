// script.js

// Account class
class Account {
    constructor(accountNumber, holderName, balance = 0) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
        return `Deposited ${amount}. New balance: ${this.balance}`;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            return 'Insufficient funds';
        }
        this.balance -= amount;
        return `Withdrew ${amount}. New balance: ${this.balance}`;
    }

    getBalance() {
        return `Balance: ${this.balance}`;
    }
}

// Customer class
class Customer {
    constructor(customerId, name) {
        this.customerId = customerId;
        this.name = name;
        this.accounts = [];
    }

    addAccount(account) {
        this.accounts.push(account);
        return `Account ${account.accountNumber} added for customer ${this.name}`;
    }

    getAccounts() {
        return this.accounts;
    }

    findAccount(accountNumber) {
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }
}

// Bank class
class Bank {
    constructor(name) {
        this.name = name;
        this.customers = [];
    }

    addCustomer(customer) {
        this.customers.push(customer);
        return `Customer ${customer.name} added to bank ${this.name}`;
    }

    getCustomer(customerId) {
        return this.customers.find(customer => customer.customerId === customerId);
    }

    getCustomerByAccountNumber(accountNumber) {
        return this.customers.find(customer => customer.findAccount(accountNumber));
    }

    transferFunds(fromAccount, toAccount, amount) {
        let fromAccResult = fromAccount.withdraw(amount);
        if (fromAccResult === 'Insufficient funds') return 'Transfer failed: Insufficient funds';
        toAccount.deposit(amount);
        return `Transferred ${amount} from ${fromAccount.accountNumber} to ${toAccount.accountNumber}`;
    }
}

// Bank instance
const bank = new Bank('My Bank');

// Merged function to create customer and account
function createCustomerAccount() {
    const customerId = document.querySelector('.moduleCreateAccount .customerId').value;
    const name = document.querySelector('.moduleCreateAccount .name').value;
    const accountNumber = document.querySelector('.moduleCreateAccount .accountNumber').value;
    const initialDeposit = parseFloat(document.querySelector('.moduleCreateAccount .amount').value);
    
    let customer = bank.getCustomer(customerId);
    
    if (!customer) {
        customer = new Customer(customerId, name);
        bank.addCustomer(customer);
        displayMessage(`Customer created: ${customer.name}`);
    }
    
    const account = new Account(accountNumber, name, initialDeposit);
    customer.addAccount(account);
    displayMessage(`Account created for customer ${customer.name} with account number ${account.accountNumber}`);
    
    clearFields('.moduleCreateAccount'); // Clear the input fields after account creation
}

// Function to generate a 5-digit random alphanumeric code
function generateValidationCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Function to deposit amount into the account
function depositAmount() {
    const customerId = document.querySelector('.moduleDepositWithdraw .customerId').value;
    const accountNumber = document.querySelector('.moduleDepositWithdraw .accountNumber').value;
    const amount = parseFloat(document.querySelector('.moduleDepositWithdraw .amount').value);
    const customer = bank.getCustomer(customerId);

    if (customer) {
        const account = customer.findAccount(accountNumber);
        if (account) {
            const validationCode = generateValidationCode();
            const userInput = prompt(`Enter the validation code: ${validationCode}`);
            if (userInput === validationCode) {
                account.deposit(amount);
                displayMessage(`Deposited ${amount} into account ${accountNumber}. New balance: ${account.getBalance()}`);
            } else {
                clearFields('.moduleDepositWithdraw');
                alert('Wrong validation');
            }
        } else {
            displayMessage('Invalid account');
        }
    } else {
        displayMessage('Invalid customer');
    }

    clearFields('.moduleDepositWithdraw');
}

// Function to withdraw amount from the account
function withdrawAmount() {
    const customerId = document.querySelector('.moduleDepositWithdraw .customerId').value;
    const accountNumber = document.querySelector('.moduleDepositWithdraw .accountNumber').value;
    const amount = parseFloat(document.querySelector('.moduleDepositWithdraw .amount').value);
    const customer = bank.getCustomer(customerId);

    if (customer) {
        const account = customer.findAccount(accountNumber);
        if (account) {
            const validationCode = generateValidationCode();
            const userInput = prompt(`Enter the validation code: ${validationCode}`);
            if (userInput === validationCode) {
                const result = account.withdraw(amount);
                displayMessage(result);
            } else {
                clearFields('.moduleDepositWithdraw');
                alert('Wrong validation');
            }
        } else {
            displayMessage('Invalid account');
        }
    } else {
        displayMessage('Invalid customer');
    }

    clearFields('.moduleDepositWithdraw');
}

// Function to check the balance of an account
function checkBalance() {
    const customerId = document.querySelector('.moduleDepositWithdraw .customerId').value;
    const accountNumber = document.querySelector('.moduleDepositWithdraw .accountNumber').value;
    const customer = bank.getCustomer(customerId);

    if (customer) {
        const account = customer.findAccount(accountNumber);
        if (account) {
            const validationCode = generateValidationCode();
            const userInput = prompt(`Enter the validation code: ${validationCode}`);
            if (userInput === validationCode) {
                displayMessage(`Account balance for ${accountNumber}: ${account.getBalance()}`);
            } else {
                clearFields('.moduleDepositWithdraw');
                alert('Wrong validation');
            }
        } else {
            displayMessage('Invalid account');
        }
    } else {
        displayMessage('Invalid customer');
    }

    clearFields('.moduleDepositWithdraw');
}

// Function to transfer funds between accounts
function transferFunds() {
    const fromAccountNumber = document.querySelector('.moduleTransfer .fromAccount').value;
    const toAccountNumber = document.querySelector('.moduleTransfer .toAccount').value;
    const amount = parseFloat(document.querySelector('.moduleTransfer .amount').value);

    // Validate alphanumeric input for account numbers
    if (!/^[a-zA-Z0-9]+$/.test(fromAccountNumber) || !/^[a-zA-Z0-9]+$/.test(toAccountNumber)) {
        displayMessage('Account numbers must be alphanumeric.');
        return;
    }

    const fromAccount = bank.getCustomerByAccountNumber(fromAccountNumber)?.findAccount(fromAccountNumber);
    const toAccount = bank.getCustomerByAccountNumber(toAccountNumber)?.findAccount(toAccountNumber);

    if (fromAccount && toAccount) {
        if (fromAccount.balance >= amount) {
            const validationCode = generateValidationCode();
            const userInput = prompt(`Enter the validation code: ${validationCode}`);
            if (userInput === validationCode) {
                const result = bank.transferFunds(fromAccount, toAccount, amount);
                displayMessage(result);
            } else {
                clearFields('.moduleTransfer');
                alert('Wrong validation');
            }
        } else {
            displayMessage('Insufficient funds in the from account.');
        }
    } else {
        displayMessage('Invalid account number(s).');
    }

    clearFields('.moduleTransfer');
}

// Function to clear input fields of a module
function clearFields(moduleClass) {
    const inputs = document.querySelectorAll(`${moduleClass} input`);
    inputs.forEach(input => input.value = '');
}

// Function to display messages
function displayMessage(message) {
    const outputElement = document.getElementById('output');
    outputElement.innerText = message;

    // Clear the message after 10 seconds
    setTimeout(() => {
        outputElement.innerText = '';
    }, 10000); // 10 seconds
}