// assets/js/minigames/puzzle.js
// Puzzle Game Variables
let puzzleGameActive = false;
let puzzleInterval = null;
let puzzleTime = 0;
let puzzleMoveCount = 0;
let currentPuzzleSize = 3;
let puzzleTiles = [];
let emptyTileIndex = null;

function initPuzzleGame() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    
    // Reset game state
    puzzleGameActive = false;
    clearInterval(puzzleInterval);
    puzzleTime = 0;
    puzzleMoveCount = 0;
    puzzleTiles = [];
    emptyTileIndex = null;

    document.getElementById('puzzleMoves').textContent = '0';
    document.getElementById('puzzleTimer').textContent = '0';

    // Clear board
    puzzleBoard.innerHTML = '';

    // Set grid columns based on puzzle size
    puzzleBoard.className = `grid grid-cols-${currentPuzzleSize} gap-1 aspect-square w-full max-w-xs mx-auto mb-4 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg`;

    // Create tiles
    const totalTiles = currentPuzzleSize * currentPuzzleSize;
    const tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1); // 1 to totalTiles-1

    // Shuffle tiles (ensuring it's solvable)
    do {
        shuffleArray(tiles);
    } while (!isPuzzleSolvable(tiles, currentPuzzleSize));

    // Add empty tile
    tiles.push(null); // Last position is empty
    emptyTileIndex = totalTiles - 1;

    // Create tile elements
    tiles.forEach((value, index) => {
        const tile = document.createElement('div');

        if (value !== null) {
            tile.className = 'bg-primary text-white flex items-center justify-center font-bold rounded-md cursor-pointer transition-all hover:bg-primary/90 active:scale-95';
            tile.textContent = value;

            // Add click handler
            tile.addEventListener('click', () => movePuzzleTile(index));
        } else {
            tile.className = 'bg-transparent';
        }

        puzzleBoard.appendChild(tile);
        puzzleTiles.push({
            element: tile,
            value: value,
            index: index
        });
    });

    // Start game
    puzzleGameActive = true;

    // Start timer
    puzzleInterval = setInterval(() => {
        puzzleTime++;
        document.getElementById('puzzleTimer').textContent = puzzleTime;
    }, 1000);
}

function isPuzzleSolvable(tiles, size) {
    // For puzzle to be solvable:
    // 1. For odd-sized puzzles: number of inversions must be even
    // 2. For even-sized puzzles: sum of inversions and row of empty tile (from bottom) must be odd

    // Count inversions
    let inversions = 0;
    for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }

    // For odd-sized puzzles
    if (size % 2 === 1) {
        return inversions % 2 === 0;
    }

    // For even-sized puzzles, we assume empty tile is at the last position
    // which is on the bottom row
    // Row from bottom = 1 (for bottom row)
    return (inversions + 1) % 2 === 1;
}

function movePuzzleTile(index) {
    if (!puzzleGameActive) return;

    // Check if the tile can be moved (adjacent to empty space)
    if (!canMoveTile(index)) return;

    // Swap tile with empty space
    const tileValue = puzzleTiles[index].value;
    const tileElement = puzzleTiles[index].element;

    // Update the clicked tile to be empty
    tileElement.className = 'bg-transparent';
    tileElement.textContent = '';
    puzzleTiles[index].value = null;

    // Update the empty tile to have the value
    const emptyElement = puzzleTiles[emptyTileIndex].element;
    emptyElement.className = 'bg-primary text-white flex items-center justify-center font-bold rounded-md cursor-pointer transition-all hover:bg-primary/90 active:scale-95';
    emptyElement.textContent = tileValue;
    puzzleTiles[emptyTileIndex].value = tileValue;

    // Update empty tile index
    emptyTileIndex = index;

    // Increment move counter
    puzzleMoveCount++;
    document.getElementById('puzzleMoves').textContent = puzzleMoveCount;

    // Check if the puzzle is solved
    if (isPuzzleSolved()) {
        endPuzzleGame();
    }
}

function canMoveTile(index) {
    const size = currentPuzzleSize;
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyTileIndex / size);
    const emptyCol = emptyTileIndex % size;

    // Tile can move if it's adjacent to the empty space
    return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
}

function isPuzzleSolved() {
    const totalTiles = currentPuzzleSize * currentPuzzleSize;

    // Check if tiles are in order 1, 2, 3, ..., empty
    for (let i = 0; i < totalTiles - 1; i++) {
        if (puzzleTiles[i].value !== i + 1) {
            return false;
        }
    }

    // Check if empty tile is in last position
    return puzzleTiles[totalTiles - 1].value === null;
}

function endPuzzleGame() {
    puzzleGameActive = false;
    clearInterval(puzzleInterval);

    // Calculate score based on moves and time
    // Lower moves and time = better score
    const baseScore = currentPuzzleSize * 100; // Base score depends on difficulty
    const movesPenalty = puzzleMoveCount * 1;
    const timePenalty = puzzleTime * 0.5;
    const score = Math.max(0, Math.floor(baseScore - movesPenalty - timePenalty));

    // Update high score if better
    if (score > gameState.minigames.puzzle.highScore) {
        gameState.minigames.puzzle.highScore = score;
    }

    // Increment play count
    gameState.minigames.puzzle.playCount++;

    // Apply sick penalty if applicable
    let xpGain = Math.min(Math.floor(score / 4), 30); // Cap at 30 XP
    if (gameState.stats.isSick) {
        xpGain = Math.floor(xpGain * 0.5); // 50% penalty
        showToast("Thú cưng đang bị ốm, thưởng giảm 50%", 3000);
    }

    gameState.stats.xp += xpGain;
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 15);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 10);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 7); // Reduced hunger
    gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - 5); // Reduced cleanliness

    updateUI();
    checkLevelUp();

    // Show congratulation message
    showToast(`Chúc mừng! Hoàn thành với ${puzzleMoveCount} bước trong ${puzzleTime}s. Điểm: ${score}, XP +${xpGain}`);

    // Save game after minigame
    saveGameState();
}