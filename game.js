// Global Variables
let gameInterval;
let snake;
let food;
let direction = "right";
let score = 0;
let gameStarted = false;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let isDarkMode = false;

// Game Elements
const canvas = document.getElementById("game-canvas");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const themeToggle = document.getElementById("themeToggle");
const leaderboardList = document.getElementById("scoreList");
const bgMusic = document.getElementById("bg-music");
const gameSound = document.getElementById("game-sound");

// Start the game
startBtn.addEventListener("click", startGame);
themeToggle.addEventListener("change", toggleTheme);

// Start Game Function
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  score = 0;
  snake = [{ x: 10, y: 10 }];
  food = spawnFood();
  direction = "right";
  updateScore();
  gameInterval = setInterval(gameLoop, 100);
  bgMusic.play();
}

// Game Loop Function
function gameLoop() {
  const head = { ...snake[0] };

  if (direction === "right") head.x++;
  if (direction === "left") head.x--;
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;

  // Check for collisions with walls or self
  if (head.x < 0 || head.y < 0 || head.x >= 30 || head.y >= 30 || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    clearInterval(gameInterval);
    saveScore();
    alert("Game Over! Your score: " + score);
    bgMusic.pause();
    return;
  }

  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = spawnFood();
    gameSound.play();
  } else {
    snake.pop();
  }

  drawGame();
}

// Spawn food at random location
function spawnFood() {
  const x = Math.floor(Math.random() * 30);
  const y = Math.floor(Math.random() * 30);
  return { x, y };
}

// Draw the game elements
function drawGame() {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach(segment => {
    context.fillStyle = "#00FF00";
    context.fillRect(segment.x * 10, segment.y * 10, 10, 10);
  });

  // Draw food
  context.fillStyle = "#FF0000";
  context.fillRect(food.x * 10, food.y * 10, 10, 10);
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = score;
}

// Save score to leaderboard
function saveScore() {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5); // Keep only top 5
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  displayLeaderboard();
}

// Display leaderboard
function displayLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.forEach(score => {
    const li = document.createElement("li");
    li.textContent = score;
    leaderboardList.appendChild(li);
  });
}

// Toggle Theme
function toggleTheme() {
  if (themeToggle.checked) {
    isDarkMode = true;
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else {
    isDarkMode = false;
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  if (event.key === "ArrowDown" && direction !== "up") direction = "down";
  if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Initial setup
window.onload = () => {
  displayLeaderboard();
};
