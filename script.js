"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Daniel Chillings',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-11-28T14:11:59.604Z',
    '2022-11-30T10:17:24.185Z',
    '2022-12-03T17:01:17.194Z',
    '2022-12-03T23:36:17.929Z',
    '2022-12-05T10:51:36.790Z',
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
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// Creating Usernames
const createUsernames = accounts => {
  accounts.forEach(account => {
    account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join("");
  });
  return accounts;
}
createUsernames(accounts);

const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 -date1)/(1000 * 60 * 60 * 24 ));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0 ) return  "Today";
  if (daysPassed === 1 ) return  "Yesterday";
  if (daysPassed <= 7 ) return  `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month =`${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return  new Intl.DateTimeFormat(locale).format(date);
};
const formattedCurrency = (value, locale, currency) => new Intl.NumberFormat(locale, {style: "currency", currency}).format(Math.abs(value));


let sorted = false;
const displayMovements = function (acc) {
  const {movements, movementsDates, locale, currency} = acc;
  containerMovements.innerHTML = "";
  const sortedMov = sorted ? movements.slice().sort((a,b) => a - b) : movements;

  sortedMov.forEach((mov, i)=> {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(movementsDates[i]);
    const displayDate = formatMovementDate(date, locale);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedCurrency(mov, locale, currency)}</div>
        </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

//calculating the Balance for Logged-in user
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formattedCurrency(acc.balance, acc.locale, acc.currency)}`;
}

//calculating the summary of the logged-in user
const calcDisplaySummary = function(acc) {

  const {movements, interestRate, locale, currency} = acc;
  const incomes = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCurrency(incomes, locale, currency);

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedCurrency(out, locale, currency);

  const interest = movements.filter(mov => mov > 0).map(deposit => interestRate/100 * deposit).filter(interest => interest >= 1).reduce((acc, interest) =>  acc + interest, 0);
  labelSumInterest.textContent = formattedCurrency(interest, locale, currency);
}

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
}
let currentAccount, timer;


function startLogOutTimer (){
 let time = 60 * 5;
 const tick = () => {
   const min = `${Math.trunc(time/60)}`.padStart(2,"0");
   const sec = String(time % 60).padStart(2, "0");
   labelTimer.textContent =  `${min}:${sec}`;
   if (time === 0) {
     clearInterval(timer);
     containerApp.style.opacity = "0";
     labelWelcome.textContent = `Log in to get started`;
   }
   time--;
 };
 tick();
  timer = setInterval(tick, 1000);
 return timer;
}

//EVENT HANDLERS
// Initializing timer for inactivity
function resetTimer() {
  if (timer) clearInterval(timer);
  startLogOutTimer();
}


btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();
  // starting timer for inactivity
 resetTimer();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = "";
// Working on the date
    const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, '0');
    // const month =`${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,'0');
    // const min = `${now.getMinutes()}`.padStart(2,'0');
    //
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long'
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);


    // removing focus from the input fields
    inputLoginUsername.blur();
    inputLoginPin.blur();

  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = "100";
  updateUI(currentAccount);
  }
  else
    console.log('Wrong Details');
})

// Working on the Transfer
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  // starting timer for inactivity
  resetTimer();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => inputTransferTo.value === acc.username);

  inputTransferAmount.value = inputTransferTo.value = '';
  // removing focus from the input fields
  inputTransferAmount.blur();
  inputTransferTo.blur();

if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username ) {

  // Doing Transfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // Adding Dates of Transfer
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

  updateUI(currentAccount);
  console.log(accounts);
}
else
  console.log('Wrong Details');
})

// Requesting Loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  // starting timer for inactivity
  resetTimer();

  const amount = Math.floor(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    setTimeout(() => {
      // Add loan Movement
      currentAccount.movements.push(amount);
      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);

  }
  inputLoanAmount.value = '';
});


// closing an account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();

   const index = accounts.findIndex( acc => acc.username === currentAccount.username);

   // Delete account
   accounts.splice(index, 1);

 // Hide UI
    labelWelcome.textContent = `Login to get started`;
    containerApp.style.opacity = "0";
 }
})

// Sorting movements
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  // reset timer for inactivity
  resetTimer();
  sorted = !sorted;
displayMovements(currentAccount, sorted);
})
