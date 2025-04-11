// assets/js/minigames/memory.js
// Memory Game Variables
let memoryCards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moveCount = 0;
let pairsFound = 0;

function initMemoryGame() {
    // Reset game state
    memoryCards = [];
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moveCount = 0;
    pairsFound = 0;

    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryPairs').textContent = '0/8';

    // Clear board
    const memoryBoard = document.getElementById('memoryBoard');
    memoryBoard.innerHTML = '';

    // Create cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cardEmojis = [...emojis, ...emojis];

    // Shuffle
    cardEmojis.sort(() => Math.random() - 0.5);

    // Create cards
    cardEmojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card relative h-20 bg-white dark:bg-gray-800 rounded-md shadow cursor-pointer';
        card.dataset.emoji = emoji;

        const front = document.createElement('div');
        front.className = 'front flex items-center justify-center text-3xl';
        front.textContent = emoji;

        const back = document.createElement('div');
        back.className = 'back bg-primary rounded-md flex items-center justify-center';
        back.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>`;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', flipCard);

        memoryBoard.appendChild(card);
        memoryCards.push(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moveCount++;
    document.getElementById('memoryMoves').textContent = moveCount;

    // Check if cards match
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
        pairsFound++;
        document.getElementById('memoryPairs').textContent = `${pairsFound}/8`;

        // Check if game is complete
        if (pairsFound === 8) {
            endMemoryGame();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function endMemoryGame() {
    // Update best score
    if (gameState.minigames.memory.bestMoves === 0 || moveCount < gameState.minigames.memory.bestMoves) {
        gameState.minigames.memory.bestMoves = moveCount;
    }

    // Increment play count
    gameState.minigames.memory.playCount++;

    // Calculate rewards based on moves
    const perfectScore = 16; // Minimum possible moves
    const maxXP = 25;

    // Apply sick penalty if applicable
    let xpGain = Math.max(5, Math.min(maxXP, Math.floor(maxXP * (perfectScore / moveCount))));
    if (gameState.stats.isSick) {
        xpGain = Math.floor(xpGain * 0.5); // 50% penalty
        showToast("Thú cưng đang bị ốm, thưởng giảm 50%", 3000);
    }

    gameState.stats.xp += xpGain;
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 15);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 8);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 5); // Reduced hunger
    gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - 3); // Reduced cleanliness

    updateUI();
    checkLevelUp();

    setTimeout(() => {
        showToast(`Chúc mừng! Hoàn thành với ${moveCount} lượt. XP +${xpGain}`);
    }, 1000);

    // Save game after minigame
    saveGameState();
}