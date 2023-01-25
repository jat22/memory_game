const gameContainer = document.getElementById("game");
const startButton = document.getElementById("startbutton");
const resetButton = document.getElementById("resetbutton");
const timerContainer = document.getElementById("timercontainer");
const timer = document.getElementById("timer");
const gameOver = document.getElementById("gameover");
const finalTime = document.getElementById("finaltime");
const newGame = document.getElementById("newgame");
const numberGuesses = document.getElementById("numberguesses")
const COLORS = ["red", "blue", "green", "orange", "purple", "red", "blue", "green", "orange", "purple"];
let previousCard= undefined;
let currentPlayArray= [];
let showingCardCount = 0;
let clickCount = 0;
let currentTime = 1;
let timerInterval = undefined;
let guessCount = undefined;
let flag = false

// helper function to shuffle array; based on Fisher Yates algo
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.add('cardback');
    newDiv.classList.add('card');
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  if(!flag){
    return;
  }
  const cards = gameContainer.querySelectorAll('div');
// if lock true do nothing
  // show face of clicked card
  event.target.classList.toggle('cardback');
  // if first click, start timer
  if (clickCount === 0){
    timeCounter ();
  };
  // add 1 to the clickcount
  clickCount += 1;
  console.log("clickcount" + clickCount)
  guessCount = clickCount / 2;
  console.log("guesscount" + guessCount);
  // add current card's color and if it is showing to array
  currentPlayArray.push({'colorClass' : event.target.classList[0] , isShowing : true});
  // when two card are showing, remove event listener, so no more cards can be clicked
  if (currentPlayArray.length === 2){
    flag = true
    // set flag true
    // loop currentPlayArray and evaluate eqaulity of colorClass; if !=, hide color
    // otherwise, cards will remain showing and the currentPlayArray is reset to empty
    setTimeout(function(){
      for (let i = 0; i < 1; i++){
        if (currentPlayArray[i].colorClass !== currentPlayArray[i+1].colorClass){
          event.target.classList.toggle('cardback');
          previousCard.classList.toggle('cardback');
          currentPlayArray = [];
        } else {
          currentPlayArray = [];
          showingCardCount += 2;
          if(showingCardCount === COLORS.length){
            youWin();
          }
        }
      }
      // set previous card equal to the card that was just clicked.
      previousCard = event.target;
      // resets event listener to all divs - 
      flag = false;
      
    }, 1000)
  } 
  // if there is only one card showing, set previousCard to current card
  // reset event listener to all divs
  else if (currentPlayArray.length < 2){
    previousCard = event.target;
    flag = false;
    }
  
}
// this function creates divs upon click and then the button is removed.
function startGame(event){
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  startButton.remove();
  timerContainer.classList.remove('hide');
  resetButton.classList.remove('hide')
}
// this function resest the game by removing current divs, reshuffling color array and creating new divs
function resetGame(){
  clearInterval(timerInterval)
  currentTime = ''
  timer.innerText = currentTime;
  let shuffledColors = shuffle(COLORS);
  while (gameContainer.firstChild){
    gameContainer.removeChild(gameContainer.firstChild)
  };
  createDivsForColors(shuffledColors);
  timerContainer.classList.remove('hide');
  gameOver.classList.add('hide');
  currentPlayArray= [];
  clickCount = 0;
  showingCardCount = 0;
  newGame.classList.add("hide");
  guessCount = 0;
}
// creates a timer, adding 1 to the count every 1 second, then updates the inner text of element to display on the page.
function timeCounter () {
  timerInterval = setInterval( function(){
    timer.innerText = currentTime
    currentTime ++ ;
  }, 1000)
  console.log('click');
}

function youWin (){
  clearInterval(timerInterval);
  timerContainer.classList.add('hide');
  gameOver.classList.remove('hide');
  finalTime.innerText = currentTime + " seconds";
  numberGuesses.innerText = guessCount
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
newGame.addEventListener('click', resetGame)
