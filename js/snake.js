document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("splash-screen").style.display = "none";

  document.getElementById("game-container").style.display = "block";

  initializeBoard();
  sessionStorage.setItem("playingSnake",true);
  startGame();
});

const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const scoreDisplay = document.getElementById("score");

const gridSize = 10;
const cellCount = gridSize * gridSize;
const boardCells = [];
let snake = [{ x: 2, y: 7 }, { x: 1, y: 7 }, { x: 0, y: 7 }];
let direction = { x: 1, y: 0 };
let fruit = { x: 7, y: 7 };
let score = 0;
let gameInterval;
let timeout = false;
let timer;
let canChangeDirection;

// Game Timer code
// change countdown to change time allowed for game
let countdown = 60;
let timerElement = document.getElementById("timer");

// Initialize the game board
function initializeBoard() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
    boardCells.push(cell);
  }
}

// Draw the snake and fruit on the board
function drawGame() {
  // Clear the board
  boardCells.forEach(cell => {
    cell.className = "cell";
  });

  // Draw the snake
  snake.forEach(segment => {
    const index = segment.y * gridSize + segment.x;
    boardCells[index].classList.add("snake");
  });

  // Draw the fruit
  const fruitIndex = fruit.y * gridSize + fruit.x;
  boardCells[fruitIndex].classList.add("fruit");
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions
  if (
    head.x < 0 || head.x >= gridSize ||
    head.y < 0 || head.y >= gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    countdown=-1;
    endGame(false);
    return;
  }

  // Add new head
  snake.unshift(head);

  // Check if the snake eats the fruit
  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    spawnFruit();
  } else {
    // Remove the tail
    snake.pop();
  }

  if(score>=10){
    countdown=-1;
    endGame(true);
  }
  canChangeDirection = true;
  drawGame();
}

// Spawn fruit in a random position
function spawnFruit() {
  let newFruit;
  do {
    newFruit = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === newFruit.x && segment.y === newFruit.y));
  fruit = newFruit;
}

// Handle keyboard input
function handleKeyPress(event) {
  if(!canChangeDirection) return;

  const key = event.key;
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }  // Left
  ];
  const currentDirectionIndex = directions.findIndex(dir => dir.x === direction.x && dir.y === direction.y);

  if (key === "ArrowLeft") {
    // Turn 90 degrees counterclockwise
    if(direction.x !== 1)
    {
      direction = directions[3];
    }
  } else if (key === "ArrowRight") {
    // Turn 90 degrees clockwise
    if(direction.x !== -1)
    {
      direction = directions[1];
    }
  } else if (key === "ArrowUp") {
    // Move Up
    if (direction.y !== 1) { // Prevent moving directly opposite (Down)
      direction = directions[0]; // { x: 0, y: -1 } is Up
    }
  } else if (key === "ArrowDown") {
    // Move Down
    if (direction.y !== -1) { // Prevent moving directly opposite (Up)
      direction = directions[2]; // { x: 0, y: 1 } is Down
    }
  }
  canChangeDirection = false;
}

// Start the game
function startGame() {
  timer = setInterval(function()
  {
      countdown--;
      console.log(countdown);
      timerElement.innerHTML = "Timer: " + countdown + "s";
      if (countdown === 0) {
          clearInterval(timer);
          timeout = true;
          endGame(false);
      }
      if(countdown < 0){
        clearInterval(timer);
      }
  } , 1000);
  startButton.style.display = "none";
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  snake = [{ x: 2, y: 7 }, { x: 1, y: 7 }, { x: 0, y: 7 }];
  direction = { x: 1, y: 0 };
  canChangeDirection = true;
  spawnFruit();
  drawGame();
  gameInterval = setInterval(moveSnake, 300);
  window.addEventListener("keydown", handleKeyPress);
}

// End the game
function endGame(win) {
  clearInterval(timer);
  if(win){
    clearInterval(gameInterval);
    timerElement.innerHTML = (`You Win! Item successfully retrieved.`);
    sessionStorage.setItem("snakeWon",true);
    window.removeEventListener("keydown", handleKeyPress);
  }
  else{
    sessionStorage.getItem("snakeWon",false);
    if(timeout){
      console.log("Time's up!");
      timerElement.innerHTML = "Time's Up! You failed to collect the item.";
    }
    clearInterval(gameInterval);
    timerElement.innerHTML = (`Game Over! Your score is ${score}.`);
  }
  let btn = document.createElement("button");
  btn.textContent = "Go Back";
  btn.style.display = "block";
  btn.style.margin = "0 auto";
  btn.onclick = () => {window.location.href = "game.html"};
  let game = document.getElementById("game-container");
  game.appendChild(btn);
}


