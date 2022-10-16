'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Ryan Iguchi',
  movements: [500, 3000, -477, 300, -1000, 750, -490],
  interestRate: 3,
  pin: 5555,
};

const account6 = {
  owner: 'Tamela Hedstrom',
  movements: [1500, 300, -4757, 3080, -100, 7500, -490],
  interestRate: 5,
  pin: 6666,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;

//////////////////////////////////////////////////////////////////////
// Using 'forEach' method to display the user's movements
// 'innerHTML' points to everything in the element, including the HTML
// 'textContent' points only to the text and not the HTML
// Used here to clear the original 'movements' from the container
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    // 'afterbegin' inserts the HTML into the beginning of the container.
    // 'beforeend' inserts the HTML into the end of the container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///////////////////////////////////////////////////////////////////////
// Using 'map' method to create a new key/value pair for each account for username and the user's initials
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0]) // Creates new  array from the first letter of each word
      .join('');
  });
};

createUsernames(accounts);

///////////////////////////////////////////////////////////////////////
// Using 'reduce' method to get and display the user's balance
const calcDisplayBalance = function (acc) {
  // Create new k/v pair, 'balance'
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

///////////////////////////////////////////////////////////////////////

// Calculate and display IN /OUT amounts and interest

const calcDisplaySummary = function (acc) {
  labelSumIn.textContent = `${acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)}€`;

  labelSumOut.textContent = `${Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  )}€`;

  labelSumInterest.textContent = acc.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
};

///////////////////////////////////////////////////////////////////////

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
///////////////////////////////////////////////////////////////////////

// Login

// Event Handlers
// In forms, hitting enter in input fields will also trigger a 'click' event

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevents form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Use optional chaining in case 'currentAccount' is undefined
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur(); // Causes field to lose focus

    updateUI(currentAccount);
  }
});

///////////////////////////////////////////////////////////////////////

// Transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

///////////////////////////////////////////////////////////////////////
// Request loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

///////////////////////////////////////////////////////////////////////

// Close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // Remove the account from the 'accounts' array
    // 'splice' willl mutate the original array
    accounts.splice(index, 1);

    // Logout user
    currentAccount = '';

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

///////////////////////////////////////////////////////////////////////
// Want to use 'true' / 'false' as a parameter depending on if the movements are sorted or not.
// Use boolean for sorted
// Use the opposite '!sorted' as the parameter
// Change state '!sorted'
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
