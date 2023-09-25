'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    new Date(new Date() - 1000 * 60 * 60 * 24 * 6),
    new Date(new Date() - 1000 * 60 * 60 * 24 * 3),
    new Date(new Date() - 1000 * 60 * 60 * 24),
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    new Date(new Date() - 1000 * 60 * 60 * 24 * 6),
    new Date(new Date() - 1000 * 60 * 60 * 24 * 3),
    new Date(new Date() - 1000 * 60 * 60 * 24),
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs((day2 - day1) / 1000 / 60 / 60 / 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = `${date.getFullYear()}`.padStart(2, 0);

  // return `${month}/${day}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency, //TODO: Kann ausgelassen werden?
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovement = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// ▒▒▒▒▒▒▒▒▄▄▄▄▄▄▄▄▒▒▒▒▒▒
// ▒▒█▒▒▒▄██████████▄▒▒▒▒
// ▒█▐▒▒▒████████████▒▒▒▒
// ▒▌▐▒▒██▄▀██████▀▄██▒▒▒
// ▐┼▐▒▒██▄▄▄▄██▄▄▄▄██▒▒▒
// ▐┼▐▒▒██████████████▒▒▒
// ▐▄▐████─▀▐▐▀█─█─▌▐██▄▒
// ▒▒█████──────────▐███▌
// ▒▒█▀▀██▄█─▄───▐─▄███▀▒
// ▒▒█▒▒███████▄██████▒▒▒
// ▒▒▒▒▒██████████████▒▒▒
// ▒▒▒▒▒█████████▐▌██▌▒▒▒
// ▒▒▒▒▒▐▀▐▒▌▀█▀▒▐▒█▒▒▒▒▒
// ▒▒▒▒▒▒▒▒▒▒▒▐▒▒▒▒▌▒▒▒▒▒

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const seconds = String(timer % 60).padStart(2, 0);

    // in each call print remaining time to interface
    labelTimer.textContent = `${min}:${seconds}`;

    //when 0 seconds, stop timer and log out user
    if (timer === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started!';
      currentAccount = '';
      clearInterval(tickDown);
    }

    //decrease 1 second
    // console.log(timer);
    timer--;
  };
  // set time to 10 minutes
  let timer = 10;
  tick();
  // call timer every second
  const tickDown = setInterval(tick, 1000);

  return tickDown;
};

const resetTimer = () => {
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN TODO:
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //current date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = `${now.getFullYear()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

    //update time every second
    const updateTime = () => {
      const now = new Date();
      const option = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      };

      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        option
      ).format(now);
    };

    updateTime(); //initial call
    setInterval(updateTime, 1000); //every second

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    resetTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset timer
    resetTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
  resetTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  clearInterval(timer);
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;

// const isEven = input => input % 2 === 0;

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//   });
// });

// console.log(document.querySelectorAll('.movements__row'));
// console.log([...document.querySelectorAll('.movements__row')]);

// const diameter = 289_234_890_238_940_183_490n;

// const now = new Date();
// console.log(now);
// console.log(new Date(0)); //UNIX Time, January first on 1970

// // working with dates
// const future = new Date(2038, 12, 12, 12, 12, 12);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth()); // zero based, important!
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log('-----------------------------');
// console.log(future.getTime());
// console.log(new Date(future.getTime()));
// console.log(Date.now());

// future.setFullYear(2023);
// console.log(future.getFullYear());
// console.log(+future);

// const dayspassed = calcDaysPassed(new Date(2037, 3, 14), future);
// console.log(dayspassed);

// const now = new Date();
// const midnight = new Date('September 25, 2023');

// console.log(calcDaysPassed(midnight, now));

// const num = 32724974.23;

// const options = {
//   style: 'currency',
//   currency: 'EUR',
// };

// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log(new Intl.NumberFormat('de-DE', options).format(num));

// //set Timeout -> Executes once
// const ingredients = ['olives', 'spinach'];

// const pizzaDelivery = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// ); //1000ms is 1 second

// //clear timeout stops timer, but timer has to be in a variable for clearTimeout to work
// if (ingredients.includes('spinach')) clearTimeout(pizzaDelivery);

// setInterval -> executes every x time

// const format = {
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric',
//   hour12: false,
// };

// setInterval(function () {
//   const now = new Date();
//   console.log(new Intl.DateTimeFormat('en-US', format).format(now));
// }, 1000);
