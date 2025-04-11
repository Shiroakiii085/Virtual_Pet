// assets/js/minigames/ball-catch.js
// Ball Catch Game
let ballCatchGameActive = false;
let ballCatchInterval = null;
let ballCatchTimeInterval = null;
let missedBalls = 0;
let currentScore = 0;
let gameTime = 0;
let ballSpawnRate = 1500; 
let isFreezeModeActive = false;
let freezeTimeLeft = 0;
let isHelperModeActive = false;
let helperTimeLeft = 0;
let difficulty = 1;

const MAX_MISSED_BALLS = 10;
const BALL_TYPES = {
    NORMAL: 'normal',
    FAST: 'fast',
    FREEZE: 'freeze',
    HELPER: 'helper',
    DANGER: 'danger'
};

// Helper pets to catch balls
let helperPetActive = false;
let helperIntervals = [];

// Reset helper pet intervals
function clearHelperIntervals() {
    helperIntervals.forEach(interval => clearInterval(interval));
    helperIntervals = [];
}

function initBallCatchGame() {
    const startBallCatch = document.getElementById('startBallCatch');
    
    if (ballCatchGameActive) return;

    // Hide instructions
    document.getElementById('ballCatchInstructions').classList.add('hidden');

    // Reset game
    ballCatchGameActive = true;
    currentScore = 0;
    gameTime = 0;
    missedBalls = 0;
    difficulty = 1;
    ballSpawnRate = 1500;
    isFreezeModeActive = false;
    isHelperModeActive = false;
    freezeTimeLeft = 0;
    helperTimeLeft = 0;

    document.getElementById('ballCatchScore').textContent = '0';
    document.getElementById('ballCatchTimer').textContent = '0';
    document.getElementById('ballCatchMissed').textContent = '0';

    // Clear any balls and effects
    const balls = document.querySelectorAll('.game-ball');
    balls.forEach(ball => ball.remove());

    document.getElementById('freezeEffect').classList.add('hidden');
    document.getElementById('petHelperEffect').classList.add('hidden');
    document.getElementById('freezeStatus').classList.add('hidden');
    document.getElementById('helperStatus').classList.add('hidden');
    document.getElementById('helperPet').classList.add('hidden');

    clearHelperIntervals();

    // Add pet to game
    const drawPetFunc = getPetDrawFunction(gameState.selectedPet);
    drawPetFunc(document.getElementById('ballCatchPet'));

    // Start game
    scheduleBallCreation();

    // Timer to track game duration and increase difficulty
    ballCatchTimeInterval = setInterval(() => {
        gameTime++;
        document.getElementById('ballCatchTimer').textContent = gameTime;

        // Increase difficulty every 15 seconds
        if (gameTime % 15 === 0) {
            increaseDifficulty();
        }

        // Update freeze effect countdown
        if (isFreezeModeActive) {
            freezeTimeLeft--;
            document.getElementById('freezeTime').textContent = freezeTimeLeft;

            if (freezeTimeLeft <= 0) {
                deactivateFreezeMode();
            }
        }

        // Update helper effect countdown
        if (isHelperModeActive) {
            helperTimeLeft--;
            document.getElementById('helperTime').textContent = helperTimeLeft;

            if (helperTimeLeft <= 0) {
                deactivateHelperMode();
            }
        }
    }, 1000);

    startBallCatch.textContent = 'Đang chơi...';
    startBallCatch.disabled = true;
    startBallCatch.classList.add('opacity-50');
}

function scheduleBallCreation() {
    if (!ballCatchGameActive) return;

    // Schedule next ball
    ballCatchInterval = setTimeout(() => {
        createBall();

        // If active, create a new ball
        if (ballCatchGameActive) {
            scheduleBallCreation();
        }
    }, calculateSpawnDelay());
}

function calculateSpawnDelay() {
    // Base spawn rate that decreases with difficulty (faster spawns)
    const baseDelay = Math.max(300, ballSpawnRate - (difficulty * 100));

    // Add some randomness
    return baseDelay + (Math.random() * 300);
}

function increaseDifficulty() {
    difficulty = Math.min(10, difficulty + 0.5);
    ballSpawnRate = Math.max(300, ballSpawnRate - 100);

    // Show difficulty increase notification
    if (gameTime > 0 && gameTime % 30 === 0) {
        showToast(`Độ khó tăng lên! Cấp độ: ${Math.floor(difficulty)}`);
    }
}

function createBall() {
    const ballCatchArea = document.getElementById('ballCatchArea');
    if (!ballCatchGameActive) return;

    // Determine ball type based on time and randomness
    const ballType = determineBallType();

    const ball = document.createElement('div');
    ball.className = 'game-ball absolute w-8 h-8 rounded-full shadow-md cursor-pointer z-10';
    ball.dataset.type = ballType;

    // Style based on ball type
    switch (ballType) {
        case BALL_TYPES.NORMAL:
            ball.classList.add('bg-yellow-400', 'dark:bg-yellow-500');
            break;
        case BALL_TYPES.FAST:
            ball.classList.add('bg-red-500', 'dark:bg-red-600');
            break;
        case BALL_TYPES.FREEZE:
            ball.classList.add('bg-blue-500', 'dark:bg-blue-600');
            break;
        case BALL_TYPES.HELPER:
            ball.classList.add('bg-green-500', 'dark:bg-green-600');
            break;
        case BALL_TYPES.DANGER:
            ball.classList.add('bg-black', 'dark:bg-gray-900');
            break;
    }

    // Random position at the top
    const left = Math.floor(Math.random() * (ballCatchArea.offsetWidth - 40));
    ball.style.left = `${left}px`;
    ball.style.top = '0';

    // Ball caught event
    ball.addEventListener('click', () => handleBallCaught(ball));

    // Add ball to the game area
    ballCatchArea.appendChild(ball);

    // Animate ball falling
    animateBallFalling(ball, ballType);
}

function determineBallType() {
    // Base probabilities
    let normalProb = 0.75; (Math.min(0.50, difficulty * 0.050));
    let fastProb = 0.05 + (Math.min(0.25, difficulty * 0.025)); 
    let freezeProb = 0.03; (Math.min(0.10, difficulty * 0.010));
    let helperProb = 0.03; (Math.min(0.20, difficulty * 0.020)); 
    let dangerProb = 0.03 + (Math.min(0.15, difficulty * 0.025)); 

    // Adjust probabilities based on game time
    if (gameTime > 30) {
        normalProb -= 0.1;
        fastProb += 0.05;
        dangerProb += 0.05;
        freezeProb += 0.01;
        helperProb += 0.02;
    }

    // Roll for ball type
    const roll = Math.random();

    if (roll < dangerProb) return BALL_TYPES.DANGER;
    if (roll < dangerProb + fastProb) return BALL_TYPES.FAST;
    if (roll < dangerProb + fastProb + freezeProb) return BALL_TYPES.FREEZE;
    if (roll < dangerProb + fastProb + freezeProb + helperProb) return BALL_TYPES.HELPER;
    return BALL_TYPES.NORMAL;
}

function animateBallFalling(ball, ballType) {
    const ballCatchArea = document.getElementById('ballCatchArea');
    const helperPetElement = document.getElementById('helperPet');
    
    let topPos = 0;
    let isFrozen = false;

    // Determine fall speed based on ball type and difficulty
    let fallSpeed = 1 + (difficulty * 0.3); // Base speed increases with difficulty

    if (ballType === BALL_TYPES.FAST) {
        fallSpeed = fallSpeed * 2; // Fast balls fall much quicker
        // Add visual effect for fast balls
        ball.classList.add('animate-pulse');
    }

    const fallInterval = setInterval(() => {
        // If game ended or ball was removed
        if (!ballCatchGameActive || !ball.isConnected) {
            clearInterval(fallInterval);
            return;
        }

        // Check if in freeze mode
        if (isFreezeModeActive && ballType !== BALL_TYPES.FREEZE) {
            isFrozen = true;
            return; // Don't update position while frozen
        } else if (isFrozen) {
            isFrozen = false; // Resume falling after freeze ends
        }

        // Update position
        topPos += fallSpeed;
        ball.style.top = `${topPos}px`;

        // Check if ball reaches bottom
        if (topPos > ballCatchArea.offsetHeight - 32) {
            clearInterval(fallInterval);

            // Only count missed balls if still connected to DOM
            if (ball.isConnected) {
                handleMissedBall(ball);
                // Remove ball
                ball.remove();
            }
        }

        // Check for helper pet auto-catch for normal yellow balls
        if (isHelperModeActive && ballType === BALL_TYPES.NORMAL &&
            helperPetElement.classList.contains('active') &&
            !ball.classList.contains('being-caught') &&
            Math.random() < 0.03) { // 3% chance per frame to attempt catch

            tryCatchWithHelper(ball);
        }
    }, 20);
}

function tryCatchWithHelper(ball) {
    const ballCatchArea = document.getElementById('ballCatchArea');
    const helperPetElement = document.getElementById('helperPet');
    
    if (!ball.isConnected) return; // Ball already gone

    ball.classList.add('being-caught');

    // Move helper toward ball
    const ballRect = ball.getBoundingClientRect();
    const helperRect = helperPetElement.getBoundingClientRect();
    const areaRect = ballCatchArea.getBoundingClientRect();

    // Relative positions within the game area
    const ballX = ballRect.left - areaRect.left + (ballRect.width / 2);
    const ballY = ballRect.top - areaRect.top + (ballRect.height / 2);

    // Animate helper pet moving to catch the ball
    helperPetElement.style.transition = 'transform 0.3s ease-out';
    helperPetElement.style.transform = `translate(${ballX - helperRect.width}px, ${ballY - helperRect.height}px)`;

    // Wait a moment then catch the ball
    setTimeout(() => {
        if (ball.isConnected) { // Make sure ball still exists
            handleBallCaught(ball, true);
        }

        // Reset helper position after a short delay
        setTimeout(() => {
            helperPetElement.style.transition = 'transform 0.5s ease-out';
            helperPetElement.style.transform = '';
        }, 200);
    }, 300);
}

function handleBallCaught(ball, isCaughtByHelper = false) {
    const ballCatchScore = document.getElementById('ballCatchScore');
    
    const ballType = ball.dataset.type;

    // Handle special effects
    switch (ballType) {
        case BALL_TYPES.NORMAL:
            // Regular ball: 1 point
            currentScore += 1;
            break;

        case BALL_TYPES.FAST:
            // Fast ball: 3 points
            currentScore += 3;
            // Visual feedback
            showBallCaughtEffect(ball, '+3', 'text-red-500');
            break;

        case BALL_TYPES.FREEZE:
            // Freeze ball: 2 points + freeze effect
            currentScore += 2;
            activateFreezeMode();
            showBallCaughtEffect(ball, 'Đóng băng!', 'text-blue-500');
            break;

        case BALL_TYPES.HELPER:
            // Helper ball: 2 points + helper pet
            currentScore += 2;
            activateHelperMode();
            showBallCaughtEffect(ball, 'Hỗ trợ!', 'text-green-500');
            break;

        case BALL_TYPES.DANGER:
            // Danger ball: 5 points (high risk, high reward)
            currentScore += 5;
            showBallCaughtEffect(ball, '+5', 'text-purple-500');
            break;
    }

    // Update score
    ballCatchScore.textContent = currentScore;

    // Create pop effect
    if (!isCaughtByHelper) {
        createPopEffect(ball);
    }

    // Remove ball
    ball.remove();
}

function handleMissedBall(ball) {
    const ballCatchMissed = document.getElementById('ballCatchMissed');
    
    const ballType = ball.dataset.type;

    if (ballType === BALL_TYPES.DANGER) {
        // Danger ball counts as 3 missed balls
        missedBalls += 3;
        showMissEffect(ball, '+3 lỗi!', 'text-red-500');
    } else {
        // Regular missed ball
        missedBalls += 1;
    }

    // Update missed counter
    ballCatchMissed.textContent = missedBalls;

    // Check if game over
    if (missedBalls >= MAX_MISSED_BALLS) {
        endBallCatchGame();
    }
}

function showBallCaughtEffect(ball, text, colorClass) {
    const ballCatchArea = document.getElementById('ballCatchArea');
    
    const effect = document.createElement('div');
    effect.className = `absolute text-lg font-bold ${colorClass} pointer-events-none`;
    effect.textContent = text;

    // Position effect at ball location
    const ballRect = ball.getBoundingClientRect();
    const areaRect = ballCatchArea.getBoundingClientRect();

    effect.style.left = `${ballRect.left - areaRect.left}px`;
    effect.style.top = `${ballRect.top - areaRect.top}px`;

    // Add to game area
    ballCatchArea.appendChild(effect);

    // Animate and remove
    effect.animate(
        [
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-20px)', opacity: 0 }
        ],
        { duration: 1000, easing: 'ease-out' }
    );

    setTimeout(() => effect.remove(), 1000);
}

function showMissEffect(ball, text, colorClass) {
    const ballCatchArea = document.getElementById('ballCatchArea');
    
    const effect = document.createElement('div');
    effect.className = `absolute text-lg font-bold ${colorClass} pointer-events-none`;
    effect.textContent = text;

    // Position effect at ball location
    const ballRect = ball.getBoundingClientRect();
    const areaRect = ballCatchArea.getBoundingClientRect();

    effect.style.left = `${ballRect.left - areaRect.left}px`;
    effect.style.top = `${ballRect.top - areaRect.top}px`;

    // Add to game area
    ballCatchArea.appendChild(effect);

    // Animate and remove
    effect.animate(
        [
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(20px)', opacity: 0 }
        ],
        { duration: 1000, easing: 'ease-out' }
    );

    setTimeout(() => effect.remove(), 1000);
}

function createPopEffect(ball) {
    const ballCatchArea = document.getElementById('ballCatchArea');
    
    // Create a pop effect at the ball's position
    const pop = document.createElement('div');
    pop.className = 'absolute w-8 h-8 rounded-full pointer-events-none';

    // Get ball's position
    const ballRect = ball.getBoundingClientRect();
    const areaRect = ballCatchArea.getBoundingClientRect();

    pop.style.left = `${ballRect.left - areaRect.left}px`;
    pop.style.top = `${ballRect.top - areaRect.top}px`;

    // Get ball's color and add to pop effect
    if (ball.classList.contains('bg-yellow-400')) {
        pop.classList.add('bg-yellow-300');
    } else if (ball.classList.contains('bg-red-500')) {
        pop.classList.add('bg-red-300');
    } else if (ball.classList.contains('bg-blue-500')) {
        pop.classList.add('bg-blue-300');
    } else if (ball.classList.contains('bg-green-500')) {
        pop.classList.add('bg-green-300');
    } else if (ball.classList.contains('bg-black')) {
        pop.classList.add('bg-gray-600');
    }

    // Add to game area
    ballCatchArea.appendChild(pop);

    // Animate and remove
    pop.animate(
        [
            { transform: 'scale(1)', opacity: 0.7 },
            { transform: 'scale(1.5)', opacity: 0 }
        ],
        { duration: 300, easing: 'ease-out' }
    );

    setTimeout(() => pop.remove(), 300);
}

function activateFreezeMode() {
    const freezeEffect = document.getElementById('freezeEffect');
    const freezeStatus = document.getElementById('freezeStatus');
    const freezeTime = document.getElementById('freezeTime');
    
    isFreezeModeActive = true;
    freezeTimeLeft = 5; // 5 seconds of freeze

    // Display freeze effect
    freezeEffect.classList.remove('hidden');
    freezeStatus.classList.remove('hidden');
    freezeTime.textContent = freezeTimeLeft;
}

function deactivateFreezeMode() {
    const freezeEffect = document.getElementById('freezeEffect');
    const freezeStatus = document.getElementById('freezeStatus');
    
    isFreezeModeActive = false;
    freezeEffect.classList.add('hidden');
    freezeStatus.classList.add('hidden');
}

function activateHelperMode() {
    const petHelperEffect = document.getElementById('petHelperEffect');
    const helperStatus = document.getElementById('helperStatus');
    const helperTime = document.getElementById('helperTime');
    const helperPetElement = document.getElementById('helperPet');
    
    isHelperModeActive = true;
    helperTimeLeft = 8; // 8 seconds of helper

    // Display helper effect
    petHelperEffect.classList.remove('hidden');
    helperStatus.classList.remove('hidden');
    helperTime.textContent = helperTimeLeft;

    // Show helper pet
    helperPetElement.classList.remove('hidden');
    helperPetElement.classList.add('active');

    // Draw the same pet type for helper
    const drawPetFunc = getPetDrawFunction(gameState.selectedPet);
    drawPetFunc(helperPetElement);
}

function deactivateHelperMode() {
    const petHelperEffect = document.getElementById('petHelperEffect');
    const helperStatus = document.getElementById('helperStatus');
    const helperPetElement = document.getElementById('helperPet');
    
    isHelperModeActive = false;
    petHelperEffect.classList.add('hidden');
    helperStatus.classList.add('hidden');
    helperPetElement.classList.add('hidden');
    helperPetElement.classList.remove('active');

    // Clear helper pet intervals
    clearHelperIntervals();
}

function endBallCatchGame() {
    const startBallCatch = document.getElementById('startBallCatch');
    
    ballCatchGameActive = false;

    // Clear all intervals
    clearTimeout(ballCatchInterval);
    clearInterval(ballCatchTimeInterval);
    clearHelperIntervals();

    // Deactivate special effects
    deactivateFreezeMode();
    deactivateHelperMode();

    // Remove all balls
    const balls = document.querySelectorAll('.game-ball');
    balls.forEach(ball => ball.remove());

    // Update high score
    if (currentScore > gameState.minigames.ballCatch.highScore) {
        gameState.minigames.ballCatch.highScore = currentScore;
    }

    // Increment play count
    gameState.minigames.ballCatch.playCount++;

    // Calculate rewards based on score and game time
    const baseXP = Math.min(Math.floor(currentScore / 2), 40);
    const timeBonus = Math.min(Math.floor(gameTime / 10), 10);

    // Apply sick penalty if applicable
    let xpGain = baseXP + timeBonus;
    if (gameState.stats.isSick) {
        xpGain = Math.floor(xpGain * 0.5); // 50% penalty
        showToast("Thú cưng đang bị ốm, thưởng giảm 50%", 3000);
    }

    const happinessGain = Math.min(Math.floor(currentScore / 3), 25);

    gameState.stats.xp += xpGain;
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + happinessGain);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 12);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 10); // Reduced hunger
    gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - 8); // Reduced cleanliness

    updateUI();
    checkLevelUp();

    // Reset button
    startBallCatch.textContent = 'Chơi lại';
    startBallCatch.disabled = false;
    startBallCatch.classList.remove('opacity-50');

    // Show game result
    let resultMessage = `Kết thúc! Điểm: ${currentScore}, Thời gian: ${gameTime}s`;
    if (missedBalls >= MAX_MISSED_BALLS) {
        resultMessage = `Đã bỏ lỡ ${missedBalls}/${MAX_MISSED_BALLS} quả bóng! ` + resultMessage;
    }

    showToast(`${resultMessage}, XP +${xpGain}`);

    // Show instructions again
    document.getElementById('ballCatchInstructions').classList.remove('hidden');

    // Save game after minigame
    saveGameState();
}