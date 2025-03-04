// Game constants
const GAME_WIDTH = document.getElementById('game-container').clientWidth;
const GAME_HEIGHT = document.getElementById('game-container').clientHeight;
const PLAYER_SIZE = 50;
const CRITIC_SIZE = 40;
const BOOK_SIZE = 30;
const PLAYER_SPEED = 5;
const CRITIC_SPEED = 2;
const MAX_CRITICS = 10;
const MAX_BOOKS = 5;

// Game state
let gameActive = false;
let player = null;
let critics = [];
let books = [];
let score = 0;
let lives = 3;
let animationId = null;
let touchStartX = 0;
let touchStartY = 0;
let playerTargetX = 0;
let playerTargetY = 0;
let isPlayerMoving = false;

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const finalScoreDisplay = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Initialize game
function initGame() {
    // Reset game state
    gameActive = true;
    score = 0;
    lives = 3;
    critics = [];
    books = [];
    
    // Update displays
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    
    // Create player
    createPlayer();
    
    // Start game loop
    gameLoop();
    
    // Spawn initial critics and books
    spawnEntities();
}

// Create player character
function createPlayer() {
    playerTargetX = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
    playerTargetY = GAME_HEIGHT / 2 - PLAYER_SIZE / 2;
    
    player = document.createElement('div');
    player.className = 'player';
    player.style.left = `${playerTargetX}px`;
    player.style.top = `${playerTargetY}px`;
    
    // Add Tom Wolfe SVG icon
    player.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <circle cx="35" cy="40" r="5" fill="#000000"/>
            <circle cx="65" cy="40" r="5" fill="#000000"/>
            <path d="M 30 65 Q 50 80 70 65" fill="none" stroke="#000000" stroke-width="3"/>
            <path d="M 30 30 L 70 30 L 70 20 L 30 20 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <rect x="40" y="5" width="20" height="15" fill="#ffffff" stroke="#000000" stroke-width="2"/>
        </svg>
    `;
    
    gameArea.appendChild(player);
}

// Create a critic
function createCritic() {
    const critic = document.createElement('div');
    critic.className = 'critic';
    
    // Random position off screen
    let x, y;
    const side = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
    
    switch(side) {
        case 0: // top
            x = Math.random() * GAME_WIDTH;
            y = -CRITIC_SIZE;
            break;
        case 1: // right
            x = GAME_WIDTH;
            y = Math.random() * GAME_HEIGHT;
            break;
        case 2: // bottom
            x = Math.random() * GAME_WIDTH;
            y = GAME_HEIGHT;
            break;
        case 3: // left
            x = -CRITIC_SIZE;
            y = Math.random() * GAME_HEIGHT;
            break;
    }
    
    critic.style.left = `${x}px`;
    critic.style.top = `${y}px`;
    
    // Add critic SVG icon
    critic.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#e74c3c" stroke="#000000" stroke-width="2"/>
            <line x1="30" y1="30" x2="45" y2="45" stroke="#000000" stroke-width="5"/>
            <line x1="45" y1="30" x2="30" y2="45" stroke="#000000" stroke-width="5"/>
            <line x1="55" y1="30" x2="70" y2="45" stroke="#000000" stroke-width="5"/>
            <line x1="70" y1="30" x2="55" y2="45" stroke="#000000" stroke-width="5"/>
            <path d="M 30 70 Q 50 50 70 70" fill="none" stroke="#000000" stroke-width="3"/>
        </svg>
    `;
    
    gameArea.appendChild(critic);
    critics.push({
        element: critic,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0
    });
}

// Create a book
function createBook() {
    const book = document.createElement('div');
    book.className = 'book';
    
    // Random position within game area
    const x = Math.random() * (GAME_WIDTH - BOOK_SIZE);
    const y = Math.random() * (GAME_HEIGHT - BOOK_SIZE);
    
    book.style.left = `${x}px`;
    book.style.top = `${y}px`;
    
    // Add book SVG icon
    book.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="80" height="60" fill="#f1c40f" stroke="#000000" stroke-width="2"/>
            <rect x="10" y="20" width="15" height="60" fill="#e67e22" stroke="#000000" stroke-width="1"/>
            <line x1="30" y1="35" x2="80" y2="35" stroke="#000000" stroke-width="2"/>
            <line x1="30" y1="45" x2="80" y2="45" stroke="#000000" stroke-width="2"/>
            <line x1="30" y1="55" x2="80" y2="55" stroke="#000000" stroke-width="2"/>
            <line x1="30" y1="65" x2="80" y2="65" stroke="#000000" stroke-width="2"/>
        </svg>
    `;
    
    gameArea.appendChild(book);
    books.push({
        element: book,
        x: x,
        y: y
    });
}

// Spawn critics and books
function spawnEntities() {
    // Spawn initial critics
    for (let i = 0; i < 3; i++) {
        createCritic();
    }
    
    // Spawn initial books
    for (let i = 0; i < 3; i++) {
        createBook();
    }
    
    // Continue spawning critics and books
    setInterval(() => {
        if (gameActive && critics.length < MAX_CRITICS) {
            createCritic();
        }
    }, 3000);
    
    setInterval(() => {
        if (gameActive && books.length < MAX_BOOKS) {
            createBook();
        }
    }, 5000);
}

// Move player based on keyboard input
function movePlayer() {
    if (!player) return;
    
    // If using touch/click, move towards target
    if (isPlayerMoving) {
        const dx = playerTargetX - parseFloat(player.style.left);
        const dy = playerTargetY - parseFloat(player.style.top);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > PLAYER_SPEED) {
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * PLAYER_SPEED;
            const moveY = Math.sin(angle) * PLAYER_SPEED;
            
            const newX = parseFloat(player.style.left) + moveX;
            const newY = parseFloat(player.style.top) + moveY;
            
            player.style.left = `${newX}px`;
            player.style.top = `${newY}px`;
        } else {
            player.style.left = `${playerTargetX}px`;
            player.style.top = `${playerTargetY}px`;
            isPlayerMoving = false;
        }
    }
    
    // Ensure player stays within game area
    const x = parseFloat(player.style.left);
    const y = parseFloat(player.style.top);
    
    if (x < 0) player.style.left = '0px';
    if (x > GAME_WIDTH - PLAYER_SIZE) player.style.left = `${GAME_WIDTH - PLAYER_SIZE}px`;
    if (y < 0) player.style.top = '0px';
    if (y > GAME_HEIGHT - PLAYER_SIZE) player.style.top = `${GAME_HEIGHT - PLAYER_SIZE}px`;
}

// Move critics towards player
function moveCritics() {
    if (!player) return;
    
    const playerX = parseFloat(player.style.left) + PLAYER_SIZE / 2;
    const playerY = parseFloat(player.style.top) + PLAYER_SIZE / 2;
    
    critics.forEach(critic => {
        // Calculate direction to player
        const dx = playerX - (critic.x + CRITIC_SIZE / 2);
        const dy = playerY - (critic.y + CRITIC_SIZE / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            critic.speedX = (dx / distance) * CRITIC_SPEED;
            critic.speedY = (dy / distance) * CRITIC_SPEED;
        }
        
        // Update position
        critic.x += critic.speedX;
        critic.y += critic.speedY;
        
        critic.element.style.left = `${critic.x}px`;
        critic.element.style.top = `${critic.y}px`;
    });
}

// Check collisions
function checkCollisions() {
    if (!player) return;
    
    const playerRect = {
        x: parseFloat(player.style.left),
        y: parseFloat(player.style.top),
        width: PLAYER_SIZE,
        height: PLAYER_SIZE
    };
    
    // Check collisions with critics
    critics.forEach((critic, index) => {
        const criticRect = {
            x: critic.x,
            y: critic.y,
            width: CRITIC_SIZE,
            height: CRITIC_SIZE
        };
        
        if (detectCollision(playerRect, criticRect)) {
            // Lose a life when hit by a critic
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            
            // Remove the critic
            gameArea.removeChild(critic.element);
            critics.splice(index, 1);
            
            // Flash the screen red
            gameArea.style.backgroundColor = '#ffdddd';
            setTimeout(() => {
                gameArea.style.backgroundColor = '#e9ffe9';
            }, 300);
            
            // Check if game over
            if (lives <= 0) {
                endGame();
            }
        }
    });
    
    // Check collisions with books
    books.forEach((book, index) => {
        const bookRect = {
            x: book.x,
            y: book.y,
            width: BOOK_SIZE,
            height: BOOK_SIZE
        };
        
        if (detectCollision(playerRect, bookRect)) {
            // Increase score when collecting a book
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            
            // Remove the book
            gameArea.removeChild(book.element);
            books.splice(index, 1);
            
            // Flash the screen green
            gameArea.style.backgroundColor = '#ddffdd';
            setTimeout(() => {
                gameArea.style.backgroundColor = '#e9ffe9';
            }, 300);
        }
    });
}

// Helper function to detect collision between two rectangles
function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Game loop
function gameLoop() {
    if (!gameActive) return;
    
    movePlayer();
    moveCritics();
    checkCollisions();
    
    animationId = requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameActive = false;
    cancelAnimationFrame(animationId);
    
    finalScoreDisplay.textContent = score;
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    
    // Clear game area
    gameArea.innerHTML = '';
    player = null;
    critics = [];
    books = [];
}

// Start game
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    
    initGame();
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive || !player) return;
    
    const currentX = parseFloat(player.style.left);
    const currentY = parseFloat(player.style.top);
    
    switch (e.key) {
        case 'ArrowUp':
            player.style.top = `${Math.max(0, currentY - PLAYER_SPEED)}px`;
            break;
        case 'ArrowDown':
            player.style.top = `${Math.min(GAME_HEIGHT - PLAYER_SIZE, currentY + PLAYER_SPEED)}px`;
            break;
        case 'ArrowLeft':
            player.style.left = `${Math.max(0, currentX - PLAYER_SPEED)}px`;
            break;
        case 'ArrowRight':
            player.style.left = `${Math.min(GAME_WIDTH - PLAYER_SIZE, currentX + PLAYER_SPEED)}px`;
            break;
    }
});

// Mouse/touch controls
gameArea.addEventListener('mousedown', handlePointerStart);
gameArea.addEventListener('touchstart', handlePointerStart);

function handlePointerStart(e) {
    e.preventDefault();
    
    if (!gameActive || !player) return;
    
    // Get click/touch position
    let clientX, clientY;
    
    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Convert to game area coordinates
    const rect = gameArea.getBoundingClientRect();
    playerTargetX = clientX - rect.left - PLAYER_SIZE / 2;
    playerTargetY = clientY - rect.top - PLAYER_SIZE / 2;
    
    // Ensure target is within bounds
    playerTargetX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, playerTargetX));
    playerTargetY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, playerTargetY));
    
    isPlayerMoving = true;
}

// Ensure the game is responsive
window.addEventListener('resize', () => {
    // Update game dimensions
    const newWidth = document.getElementById('game-container').clientWidth;
    const newHeight = document.getElementById('game-container').clientHeight;
    
    // Scale positions if dimensions change significantly
    if (Math.abs(GAME_WIDTH - newWidth) > 10 || Math.abs(GAME_HEIGHT - newHeight) > 10) {
        location.reload(); // Simplest solution is to reload for major size changes
    }
});

// Prevent scrolling when touching the game on mobile
document.body.addEventListener('touchmove', (e) => {
    if (gameActive) {
        e.preventDefault();
    }
}, { passive: false });

