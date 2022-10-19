"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Daniel Chillings",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


let sorted = false;
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  const sortedMov = sorted ? movements.slice().sort((a,b) => a - b) : movements;

  sortedMov.forEach((mov, i)=> {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${Math.abs(mov)}€</div>
        </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

//calculating the Balance for Logged-in user
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

//calculating the summary of the logged-in user
const calcDisplaySummary = function(acc) {
  const {movements, interestRate} = acc;
  const incomes = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements.filter(mov => mov > 0).map(deposit => interestRate/100 * deposit).filter(interest => interest >= 1).reduce((acc, interest) =>  acc + interest, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
}

//EVENT HANDLERS
let currentAccount = account1;

btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = "";

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
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => inputTransferTo.value === acc.username);

  inputTransferAmount.value = inputTransferTo.value = '';
  // removing focus from the input fields
  inputTransferAmount.blur();
  inputTransferTo.blur();

if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username ) {
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);
  updateUI(currentAccount);
  console.log(accounts);
}
else
  console.log('Wrong Details');
})

// Requesting Loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    // Add Movement
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});


// closing an account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
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
  sorted = !sorted;
displayMovements(currentAccount.movements, sorted);
})

//
//  const overallBalance =  accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov , 0);
// console.log(overallBalance);
//
// const z = Array.from({length: 100}, (_, i) => Math.floor((Math.random() * i)));
// console.log(z);
