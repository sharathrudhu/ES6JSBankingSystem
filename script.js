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

    transferFunds(fromAccount, toAccount, amount) {
        let fromAcc = fromAccount.withdraw(amount);
        if (fromAcc === 'Insufficient funds') return 'Transfer failed: Insufficient funds';
        toAccount.deposit(amount);
        return `Transferred ${amount} from ${fromAccount.accountNumber} to ${toAccount.accountNumber}`;
    }
}

// Bank instance
const bank = new Bank('My Bank');

// DOM Manipulation
function createCustomer() {
    const customerId = document.getElementById('customerId').value;
    const name = document.getElementById('name').value;
    const customer = new Customer(customerId, name);
    bank.addCustomer(customer);
    displayMessage(`Customer created: ${customer.name}`);
}

function createAccount() {
    const customerId = document.getElementById('customerId').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const holderName = document.getElementById('name').value;
    const customer = bank.getCustomer(customerId);
    if (customer) {
        const account = new Account(accountNumber, holderName);
        customer.addAccount(account);
        displayMessage(`Account created for customer ${customer.name}`);
    } else {
        displayMessage(`Customer with ID ${customerId} not found`);
    }
}

function deposit() {
    const customerId = document.getElementById('customerId').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const customer = bank.getCustomer(customerId);
    if (customer) {
        const account = customer.findAccount(accountNumber);
        if (account) {
            displayMessage(account.deposit(amount));
        } else {
            displayMessage(`Account with number ${accountNumber} not found`);
        }
    } else {
        displayMessage(`Customer with ID ${customerId} not found`);
    }
}

function withdraw() {
    const customerId = document.getElementById('customerId').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const customer = bank.getCustomer(customerId);
    if (customer) {
        const account = customer.findAccount(accountNumber);
        if (account) {
            displayMessage(account.withdraw(amount));
        } else {
            displayMessage(`Account with number ${accountNumber} not found`);
        }
    } else {
        displayMessage(`Customer with ID ${customerId} not found`);
    }
}

function transferFunds() {
    const fromAccountNumber = document.getElementById('fromAccount').value;
    const toAccountNumber = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('amount').value);
    let fromAccount, toAccount;
    bank.customers.forEach(customer => {
        customer.accounts.forEach(account => {
            if (account.accountNumber === fromAccountNumber) {
                fromAccount = account;
            }
            if (account.accountNumber === toAccountNumber) {
                toAccount = account;
            }
        });
    });
    if (fromAccount && toAccount) {
        displayMessage(bank.transferFunds(fromAccount, toAccount, amount));
    } else {
        displayMessage('Invalid account numbers provided');
    }
}

function displayMessage(message) {
    document.getElementById('output').innerText = message;
}