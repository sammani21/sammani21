// Game Constants
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gridSize = 30;
const tileSize = 10;

let gameInterval;
let snake = [];
let food = {};
let direction = "right";
let score = 0;
let gameStarted = false;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let isDarkMode = false;
let lastKeyPress = null;

// Elements
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const themeToggle = document.getElementById("themeToggle");
const leaderboardList = document.getElementById("scoreList");
const bgMusic = document.getElementById("bg-music");
const gameSound = document.getElementById("game-sound");

// Setup canvas size
canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

// Event Listeners
startBtn.addEventListener("click", startGame);
themeToggle.addEventListener("change", toggleTheme);
document.addEventListener("keydown", handleDirectionChange);

// Initialize on load
window.onload = () => {
  applySavedTheme();
  displayLeaderboard();
};

// Start Game
function startGame() {
  if (gameStarted) return;

  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  score = 0;
  gameStarted = true;
  updateScore();
  bgMusic.play();
  gameInterval = setInterval(updateGame, 100);
}

// Game Loop
function updateGame() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up": head.y--; break;
    case "down": head.y++; break;
    case "left": head.x--; break;
    case "right": head.x++; break;
  }

  // Collision detection
  if (
    head.x < 0 || head.x >= gridSize ||
    head.y < 0 || head.y >= gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = generateFood();
    gameSound.play();
  } else {
    snake.pop();
  }

  draw();
}

// End Game
function endGame() {
  clearInterval(gameInterval);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  alert("Game Over! Your score: " + score);
  gameStarted = false;
  saveScore();
}

// Draw Snake and Food
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "#00FF00";
  snake.forEach(segment =>
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize)
  );

  // Food
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// Generate Food
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

// Handle Score
function updateScore() {
  scoreDisplay.textContent = score;
}

// Save and Display Leaderboard
function saveScore() {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.forEach(score => {
    const li = document.createElement("li");
    li.textContent = score;
    leaderboardList.appendChild(li);
  });
}

// Theme Toggle
function toggleTheme() {
  isDarkMode = themeToggle.checked;
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
  localStorage.setItem("snakeTheme", isDarkMode ? "dark" : "light");
}

// Apply Saved Theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem("snakeTheme");
  if (savedTheme === "dark") {
    themeToggle.checked = true;
    document.body.classList.add("dark-mode");
  } else {
    themeToggle.checked = false;
    document.body.classList.add("light-mode");
  }
}

// Keyboard Controls
function handleDirectionChange(event) {
  const key = event.key;

  const directions = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
  };

  if (directions[key] && directions[key] !== opposite[direction]) {
    direction = directions[key];
  }
}
