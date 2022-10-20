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

///////////////////////////////////////
// Coding Challenge #4

/*
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

const calcRecFood = dogs => {
   dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
};
calcRecFood(dogs);
console.log(dogs);

 //
 // const sarahDog = dogs.reduce((dog, curDog) => {
 //   curDog.owners.includes("Sarah") ? dog = curDog : dog
 //   return dog;
 // } ,{})

const sarahDog = dogs.find((dog)=> dog.owners.includes("Sarah"
));
const checkDogEatingStatus = (dog) => {
  const {owners, curFood, recFood} = dog;
  let statement =  `${owners[0]}'s dog is eating too`;
  if(curFood <= recFood * 0.9) {
    return statement += " little";
  } else if (curFood >= recFood * 1.1) {
    return statement += " much";
  }
  else {
    return statement = "The dog is eating right";
  }
};
console.log(checkDogEatingStatus(sarahDog));



const flatMapArray = (arr) => {
 return arr.flatMap((dog) => dog.owners);
};
function eatStatus(dogs) {
  const ownersEatTooMuch = flatMapArray(dogs.filter((dog) => dog.curFood >= dog.recFood * 1.1));
  const ownersEatTooLittle = flatMapArray(dogs.filter((dog)=> dog.curFood <= dog.recFood * 0.9));
  return `"${ownersEatTooMuch.join(" and ")}'s dogs eat too much!" and "${ownersEatTooLittle.join(" and ")}'s dogs eat too little!"`;
}

// like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(eatStatus(dogs));

function checkStatus(dog) {
  return dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
}
console.log(checkStatus(dogs[1]), "checkStatus");

const eatingExact = dogs.some((dog) => dog.curFood === dog.recFood  );
const eatingOkay = dogs.filter((dog) => checkStatus(dog));
console.log(eatingExact, "eating exact");
console.log(eatingOkay, "eating okay");


const dogsCopy = dogs.slice().sort((a,b) => a.recFood - b.recFood);
console.log(dogsCopy);
