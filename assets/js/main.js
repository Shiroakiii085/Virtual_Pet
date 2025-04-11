// assets/js/main.js
// Check for dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const petSelectionScreen = document.getElementById('petSelectionScreen');
    const gameScreen = document.getElementById('gameScreen');
    const minigameScreen = document.getElementById('minigameScreen');
    const settingsModal = document.getElementById('settingsModal');
    const foodSelectionModal = document.getElementById('foodSelectionModal');
    const shopModal = document.getElementById('shopModal');

    const startButton = document.getElementById('startButton');
    const continueButton = document.getElementById('continueButton');
    const adoptButton = document.getElementById('adoptButton');
    const petCards = document.querySelectorAll('.pet-card');
    const petNameInput = document.getElementById('petName');

    const actionButtons = document.querySelectorAll('.action-btn');
    const settingsButton = document.getElementById('settingsButton');
    const closeSettings = document.getElementById('closeSettings');
    const resetGameButton = document.getElementById('resetGameButton');
    const saveGameButton = document.getElementById('saveGameButton');

    const soundToggle = document.getElementById('soundToggle');
    const notificationToggle = document.getElementById('notificationToggle');
    const gameSpeedSelect = document.getElementById('gameSpeed');
    const autoSaveToggle = document.getElementById('autoSaveToggle');

    const shopButton = document.getElementById('shopButton');
    const closeShop = document.getElementById('closeShop');
    const shopTabs = document.querySelectorAll('.shop-tab');
    
    const closeFoodSelection = document.getElementById('closeFoodSelection');
    
    const minigameCards = document.querySelectorAll('.minigame-card');
    const closeMinigame = document.getElementById('closeMinigame');
    
    const startBallCatch = document.getElementById('startBallCatch');
    const resetMemoryGame = document.getElementById('resetMemoryGame');
    const startTraining = document.getElementById('startTraining');
    const resetPuzzle = document.getElementById('resetPuzzle');
    const puzzleDifficulty = document.getElementById('puzzleDifficulty');
    const startRace = document.getElementById('startRace');
    const boostButton = document.getElementById('boostButton');

    // Initialize pet previews
    const pet1 = document.getElementById('pet1');
    const pet2 = document.getElementById('pet2');
    const pet3 = document.getElementById('pet3');
    const pet4 = document.getElementById('pet4');
    const pet5 = document.getElementById('pet5');
    const pet6 = document.getElementById('pet6');
    const pet7 = document.getElementById('pet7');
    const pet8 = document.getElementById('pet8');
    const welcomePet = document.getElementById('welcomePet');

    drawCat(pet1);
    drawRabbit(pet2);
    drawDinosaur(pet3);
    drawPanda(pet4);
    drawDog(pet5);
    drawBird(pet6);
    drawFish(pet7);
    drawHamster(pet8);

    // Create SVG for welcome pet (rotating every few seconds)
    let currentWelcomePet = 0;
    const welcomePets = [drawCat, drawRabbit, drawDinosaur, drawPanda, drawDog, drawBird, drawFish, drawHamster];

    function rotateWelcomePet() {
        currentWelcomePet = (currentWelcomePet + 1) % welcomePets.length;
        welcomePets[currentWelcomePet](welcomePet);
    }

    // Initial welcome pet
    rotateWelcomePet();
    // Rotate every 3 seconds
    setInterval(rotateWelcomePet, 3000);

    // Game Functions
    function initGame(isLoaded) {
        // Set active pet if not loading saved game
        if (!isLoaded) {
            // Reset game state to default values
            gameState.stats = {
                hunger: 100,
                happiness: 100,
                cleanliness: 100,
                energy: 100,
                health: 100,
                isSick: false,
                age: 1,
                love: 0,
                xp: 0,
                coins: 10000,
                level: 1
            };
            gameState.gameTime = {
                day: 1,
                hour: 12,
                minute: 0
            };
            gameState.inventory = {
                food: [11, 12], // Start with some high-quality food
                medicine: [],
                toys: []
            };
            gameState.minigames = {
                ballCatch: {
                    highScore: 0,
                    playCount: 0
                },
                memory: {
                    bestMoves: 0,
                    playCount: 0
                },
                training: {
                    commandsLearned: 0,
                    playCount: 0
                },
                puzzle: {
                    highScore: 0,
                    playCount: 0,
                    unlocked: false
                },
                race: {
                    wins: 0,
                    playCount: 0,
                    unlocked: false
                }
            };
            gameState.isAsleep = false;
        }

        // Set active pet
        const drawPetFunc = getPetDrawFunction(gameState.selectedPet);
        drawPetFunc(document.getElementById('activePet'));

        // Check if pet is sick and apply visual
        if (gameState.stats.isSick) {
            document.getElementById('activePet').classList.add('pet-sick');
            document.getElementById('healthStatus').classList.remove('hidden');
        } else {
            document.getElementById('activePet').classList.remove('pet-sick');
            document.getElementById('healthStatus').classList.add('hidden');
        }

        // Update sleep/wake button text based on state
        updateSleepButtonText();

        // Start stats decrease interval
        startTimers();

        // Setup auto save
        setupAutoSave();

        // Update UI
        updateUI();

        // Set pet name in UI
        document.getElementById('petGameName').textContent = gameState.petName;
        document.getElementById('petLevel').textContent = `Lv.${gameState.stats.level}`;
    }

    function startTimers() {
        // Clear any existing intervals
        if (gameState.timers.statsInterval) clearInterval(gameState.timers.statsInterval);
        if (gameState.timers.dayInterval) clearInterval(gameState.timers.dayInterval);
        if (gameState.timers.sickInterval) clearInterval(gameState.timers.sickInterval);

        // Stats decrease every 10 seconds
        gameState.timers.statsInterval = setInterval(() => {
            decreaseStats();
        }, 10000);

        // Game time progresses (1 game hour = 15 real seconds)
        gameState.timers.dayInterval = setInterval(() => {
            updateGameTime();
        }, 15000);

        // Check for sickness conditions every 30 seconds
        gameState.timers.sickInterval = setInterval(() => {
            checkSicknessConditions();
        }, 30000);
    }

    function pauseGame() {
        gameState.isPaused = true;
        if (gameState.timers.statsInterval) clearInterval(gameState.timers.statsInterval);
        if (gameState.timers.dayInterval) clearInterval(gameState.timers.dayInterval);
        if (gameState.timers.sickInterval) clearInterval(gameState.timers.sickInterval);
    }

    function resumeGame() {
        gameState.isPaused = false;
        startTimers();
    }

    function decreaseStats() {
        if (gameState.isPaused) return;

        const speedMultiplier = speedMultipliers[gameState.settings.gameSpeed];

        // Sleeping pets lose hunger more slowly and recover energy
        if (gameState.isAsleep) {
            gameState.stats.hunger = Math.max(0, gameState.stats.hunger - (0.5 * speedMultiplier));
            gameState.stats.energy = Math.min(100, gameState.stats.energy + (2 * speedMultiplier));

            // If energy is full, pet wakes up
            if (gameState.stats.energy >= 100) {
                gameState.isAsleep = false;
                showToast(`${gameState.petName} đã thức dậy!`);
                updateSleepButtonText();
            }
        } else {
            // Decrease stats based on game speed
            gameState.stats.hunger = Math.max(0, gameState.stats.hunger - (2 * speedMultiplier));
            gameState.stats.happiness = Math.max(0, gameState.stats.happiness - (1.5 * speedMultiplier));
            gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - (1 * speedMultiplier));
            gameState.stats.energy = Math.max(0, gameState.stats.energy - (1.2 * speedMultiplier));

            // If pet is sick, health decreases over time
            if (gameState.stats.isSick) {
                gameState.stats.health = Math.max(0, gameState.stats.health - (0.5 * speedMultiplier));

                // If health reaches 0, pet becomes very unhappy
                if (gameState.stats.health <= 0) {
                    gameState.stats.happiness = Math.max(0, gameState.stats.happiness - 20);
                    showToast(`${gameState.petName} cảm thấy rất tệ vì bệnh nặng!`);
                }
            }
        }

        // Update UI
        updateUI();

        // Check pet mood
        checkPetMood();
    }

    function updateGameTime() {
        if (gameState.isPaused) return;

        // Advance time by 1 hour
        gameState.gameTime.hour++;

        // Day cycle
        if (gameState.gameTime.hour >= 24) {
            gameState.gameTime.hour = 0;
            gameState.gameTime.day++;

            // Daily updates
            gameState.stats.age++;
            document.getElementById('petAge').textContent = gameState.stats.age;

            // Give daily rewards
            gameState.stats.coins += 10;
            document.getElementById('petCoins').textContent = gameState.stats.coins;

            showEmotion('🎁');
        }

        // Update time display
        const hourStr = gameState.gameTime.hour.toString().padStart(2, '0');
        const minuteStr = gameState.gameTime.minute.toString().padStart(2, '0');
        document.getElementById('timeDisplay').textContent = `Ngày ${gameState.gameTime.day} - ${hourStr}:${minuteStr}`;

        // Update day/night cycle
        updateDayNightCycle();
    }

    function checkSicknessConditions() {
        if (gameState.isPaused || gameState.isAsleep || gameState.stats.isSick) return;

        // Check if low cleanliness and hunger can cause sickness
        if (gameState.stats.cleanliness < 20 && gameState.stats.hunger < 30) {
            const sickChance = 0.3; // 30% chance when both conditions are met
            if (Math.random() < sickChance) {
                // Pet gets sick
                gameState.stats.isSick = true;
                gameState.stats.health = 50; // Start at 50% health
                showToast(`${gameState.petName} bị ốm do điều kiện tệ!`, 3000);
                document.getElementById('activePet').classList.remove('pet-bounce', 'pet-shake', 'pet-pulse');
                document.getElementById('activePet').classList.add('pet-sick');
                document.getElementById('healthStatus').classList.remove('hidden');

                // Update UI
                updateUI();
            }
        }
    }

    function performAction(action) {
        if (gameState.isPaused) return;

        const activePet = document.getElementById('activePet');
        activePet.classList.remove('pet-bounce', 'pet-shake', 'pet-pulse');

        switch (action) {
            case 'clean':
                if (gameState.stats.cleanliness >= 100) {
                    showEmotion('✨');
                    document.getElementById('petStatus').textContent = `${gameState.petName} đã rất sạch sẽ!`;
                    return;
                }

                // Add cleanliness and reduce happiness slightly
                gameState.stats.cleanliness = Math.min(100, gameState.stats.cleanliness + 30);
                gameState.stats.happiness = Math.max(0, gameState.stats.happiness - 5);
                gameState.stats.energy = Math.max(0, gameState.stats.energy - 3); // Reduced energy

                // Animation
                activePet.classList.add('pet-shake');
                showEmotion('🚿');

                // Status
                document.getElementById('petStatus').textContent = `${gameState.petName} đang được tắm!`;

                // Add XP and love
                addXP(5);
                gameState.stats.love += 1;
                break;

            case 'sleep':
                if (gameState.isAsleep) {
                    // Wake up
                    gameState.isAsleep = false;
                    showEmotion('😊');
                    document.getElementById('petStatus').textContent = `${gameState.petName} đã thức dậy!`;
                    updateSleepButtonText();
                } else {
                    // Go to sleep
                    gameState.isAsleep = true;
                    gameState.stats.energy = Math.min(100, gameState.stats.energy + 30);
                    showEmotion('💤');
                    document.getElementById('petStatus').textContent = `${gameState.petName} đang ngủ ngon!`;
                    updateSleepButtonText();

                    // Add XP and love
                    addXP(5);
                }
                break;
        }

        // Update UI
        updateUI();

        // Reset animation after a delay
        setTimeout(() => {
            activePet.classList.remove('pet-bounce', 'pet-shake', 'pet-pulse');
            document.getElementById('petEmotionBubble').classList.add('hidden');
        }, 3000);

        // Save game after action
        if (gameState.settings.autoSave) {
            saveGameState();
        }
    }

    function showMinigameSelection() {
        minigameScreen.classList.remove('hidden');
        minigameScreen.classList.add('flex');
        gameScreen.classList.add('hidden');

        // Show unlocked minigames
        if (gameState.minigames.puzzle.unlocked) {
            document.getElementById('puzzleGameCard').classList.remove('hidden');
        }
        if (gameState.minigames.race.unlocked) {
            document.getElementById('raceGameCard').classList.remove('hidden');
        }

        // Show selection, hide all games
        document.getElementById('minigameSelection').classList.remove('hidden');
        document.getElementById('ballCatchGame').classList.add('hidden');
        document.getElementById('memoryGame').classList.add('hidden');
        document.getElementById('trainingGame').classList.add('hidden');
        document.getElementById('puzzleGame').classList.add('hidden');
        document.getElementById('raceGame').classList.add('hidden');

        document.getElementById('minigameTitle').textContent = "Chọn Trò Chơi";
    }

    function startMinigame(game) {
        // Hide selection, show specific game
        document.getElementById('minigameSelection').classList.add('hidden');

        switch (game) {
            case 'ballcatch':
                document.getElementById('ballCatchGame').classList.remove('hidden');
                document.getElementById('minigameTitle').textContent = "Trò Chơi Bắt Bóng";
                // Initialize ball catch game
                const drawPetFunc = getPetDrawFunction(gameState.selectedPet);
                drawPetFunc(document.getElementById('ballCatchPet'));
                break;
            case 'memory':
                document.getElementById('memoryGame').classList.remove('hidden');
                document.getElementById('minigameTitle').textContent = "Trò Chơi Trí Nhớ";
                // Initialize memory game
                initMemoryGame();
                break;
            case 'training':
                document.getElementById('trainingGame').classList.remove('hidden');
                document.getElementById('minigameTitle').textContent = "Huấn Luyện Thú Cưng";
                break;
            case 'puzzle':
                document.getElementById('puzzleGame').classList.remove('hidden');
                document.getElementById('minigameTitle').textContent = "Trò Chơi Xếp Hình";
                // Initialize puzzle game
                initPuzzleGame();
                break;
            case 'race':
                document.getElementById('raceGame').classList.remove('hidden');
                document.getElementById('minigameTitle').textContent = "Đua Thú Cưng";
                break;
        }
    }

    function hideMinigames() {
        minigameScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        // Clean up any active games
        if (ballCatchGameActive) {
            endBallCatchGame();
        }

        if (trainingActive) {
            clearTimeout(commandTimer);
            trainingActive = false;
        }

        if (puzzleGameActive) {
            clearInterval(puzzleInterval);
            puzzleGameActive = false;
        }

        if (raceActive) {
            clearInterval(raceInterval);
            raceActive = false;
        }
    }

    function resetGame() {
        // Reset game state
        gameState.selectedPet = null;
        gameState.petName = '';
        gameState.stats = {
            hunger: 100,
            happiness: 100,
            cleanliness: 100,
            energy: 100,
            health: 100,
            isSick: false,
            age: 1,
            love: 0,
            xp: 0,
            coins: 50,
            level: 1
        };
        gameState.gameTime = {
            day: 1,
            hour: 12,
            minute: 0
        };
        gameState.minigames = {
            ballCatch: {
                highScore: 0,
                playCount: 0
            },
            memory: {
                bestMoves: 0,
                playCount: 0
            },
            training: {
                commandsLearned: 0,
                playCount: 0
            },
            puzzle: {
                highScore: 0,
                playCount: 0,
                unlocked: false
            },
            race: {
                wins: 0,
                playCount: 0,
                unlocked: false
            }
        };
        gameState.inventory = {
            food: [],
            medicine: [],
            toys: []
        };
        gameState.isAsleep = false;

        // Clear intervals
        if (gameState.timers.statsInterval) clearInterval(gameState.timers.statsInterval);
        if (gameState.timers.dayInterval) clearInterval(gameState.timers.dayInterval);
        if (gameState.timers.autoSaveInterval) clearInterval(gameState.timers.autoSaveInterval);
        if (gameState.timers.sickInterval) clearInterval(gameState.timers.sickInterval);

        // Reset UI
        petCards.forEach(c => c.classList.remove('border-primary'));
        petNameInput.value = '';

        // Show selection screen
        welcomeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        petSelectionScreen.classList.add('hidden');
        minigameScreen.classList.add('hidden');
        settingsModal.classList.add('hidden');
        foodSelectionModal.classList.add('hidden');
        shopModal.classList.add('hidden');

        // Reset pet animation
        document.getElementById('activePet').classList.remove('pet-bounce', 'pet-shake', 'pet-pulse', 'pet-float', 'pet-sick');

        // Hide unlocked minigames
        document.getElementById('puzzleGameCard').classList.add('hidden');
        document.getElementById('raceGameCard').classList.add('hidden');

        // Clear localStorage
        if (isLocalStorageAvailable()) {
            localStorage.removeItem('virtualPetData');
        }

        showToast("Đã khởi tạo lại trò chơi!");
    }

    // Event Listeners
    startButton.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        petSelectionScreen.classList.remove('hidden');
        petSelectionScreen.classList.add('flex');
    });

    continueButton.addEventListener('click', () => {
        if (loadGameState()) {
            // Initialize the game with saved data
            initGame(true);

            // Hide welcome screen, show game screen
            welcomeScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('flex');

            showToast("Đã tải dữ liệu thú cưng!", 2000);
        } else {
            showToast("Không tìm thấy dữ liệu đã lưu", 3000);
        }
    });

    petCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            petCards.forEach(c => c.classList.remove('border-primary'));
            // Add selected class to the clicked card
            card.classList.add('border-primary');
            // Set selected pet
            gameState.selectedPet = index;
        });
    });

    adoptButton.addEventListener('click', () => {
        if (gameState.selectedPet === null) {
            showToast('Vui lòng chọn một thú cưng');
            return;
        }

        const name = petNameInput.value.trim();
        if (name === '') {
            showToast('Vui lòng đặt tên cho thú cưng của bạn');
            return;
        }

        gameState.petName = name;
        document.getElementById('petGameName').textContent = name;

        // Initialize the game
        initGame(false);

        // Hide selection screen, show game screen
        petSelectionScreen.classList.add('hidden');
        petSelectionScreen.classList.remove('flex');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('flex');

        // Save initial game state
        if (saveGameState()) {
            showToast("Đã lưu thú cưng mới!", 2000);
        }
    });

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');

            // Skip actions when pet is asleep (except wake up)
            if (gameState.isAsleep && action !== 'sleep') {
                showToast(`${gameState.petName} đang ngủ. Hãy đánh thức trước!`);
                return;
            }

            if (action === 'play') {
                // Show minigame selection instead of direct play action
                pauseGame();
                showMinigameSelection();
            } else if (action === 'feed') {
                // Show food selection
                showFoodSelection();
            } else {
                performAction(action);
            }
        });
    });

    // Shop button
    shopButton.addEventListener('click', () => {
        showShop();
    });

    // Close shop button
    closeShop.addEventListener('click', () => {
        shopModal.classList.add('hidden');
    });

    // Shop tabs
    shopTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            // Remove active class from all tabs
            shopTabs.forEach(t => {
                t.classList.remove('border-primary', 'text-primary');
                t.classList.add('border-transparent', 'hover:border-gray-300', 'dark:hover:border-gray-600');
            });

            // Add active class to clicked tab
            tab.classList.add('border-primary', 'text-primary');
            tab.classList.remove('border-transparent', 'hover:border-gray-300', 'dark:hover:border-gray-600');

            // Hide all tab contents
            document.getElementById('foodTab').classList.add('hidden');
            document.getElementById('medicineTab').classList.add('hidden');
            document.getElementById('minigamesTab').classList.add('hidden');
            document.getElementById('toysTab').classList.add('hidden');

            // Show the selected tab content
            if (tabName === 'food') {
                document.getElementById('foodTab').classList.remove('hidden');
            } else if (tabName === 'medicine') {
                document.getElementById('medicineTab').classList.remove('hidden');
            } else if (tabName === 'minigames') {
                document.getElementById('minigamesTab').classList.remove('hidden');
            } else if (tabName === 'toys') {
                document.getElementById('toysTab').classList.remove('hidden');
            }
        });
    });

    // Close food selection
    closeFoodSelection.addEventListener('click', () => {
        foodSelectionModal.classList.add('hidden');
    });

    minigameCards.forEach(card => {
        card.addEventListener('click', () => {
            const game = card.getAttribute('data-game');
            startMinigame(game);
        });
    });

    closeMinigame.addEventListener('click', () => {
        hideMinigames();
        resumeGame();
    });

    settingsButton.addEventListener('click', () => {
        // Pause game while settings is open
        pauseGame();

        // Update settings UI
        soundToggle.checked = gameState.settings.sound;
        notificationToggle.checked = gameState.settings.notification;
        gameSpeedSelect.value = gameState.settings.gameSpeed;
        autoSaveToggle.checked = gameState.settings.autoSave;

        // Show settings
        settingsModal.classList.remove('hidden');
    });

    closeSettings.addEventListener('click', () => {
        // Hide settings
        settingsModal.classList.add('hidden');

        // Resume game
        resumeGame();
    });

    resetGameButton.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn bắt đầu lại? Tất cả tiến trình sẽ bị mất.')) {
            resetGame();
        }
    });

    saveGameButton.addEventListener('click', () => {
        if (saveGameState()) {
            showToast("Đã lưu thành công!");
        } else {
            showToast("Không thể lưu dữ liệu");
        }
    });

    soundToggle.addEventListener('change', () => {
        gameState.settings.sound = soundToggle.checked;
    });

    notificationToggle.addEventListener('change', () => {
        gameState.settings.notification = notificationToggle.checked;
    });

    gameSpeedSelect.addEventListener('change', () => {
        gameState.settings.gameSpeed = gameSpeedSelect.value;
    });

    autoSaveToggle.addEventListener('change', () => {
        gameState.settings.autoSave = autoSaveToggle.checked;
        setupAutoSave();
    });

    // Ball Catch Game
    startBallCatch.addEventListener('click', initBallCatchGame);

    // Memory Game
    resetMemoryGame.addEventListener('click', initMemoryGame);

    // Training Game
    startTraining.addEventListener('click', initTrainingGame);

    // Puzzle Game
    resetPuzzle.addEventListener('click', initPuzzleGame);
    puzzleDifficulty.addEventListener('change', () => {
        currentPuzzleSize = parseInt(puzzleDifficulty.value);
        initPuzzleGame();
    });

    // Race Game
    startRace.addEventListener('click', initRaceGame);
    boostButton.addEventListener('click', useBoost);

    // Check if we have saved data on load
    if (isLocalStorageAvailable() && localStorage.getItem('virtualPetData')) {
        continueButton.classList.remove('hidden');
    } else {
        continueButton.classList.add('hidden');
    }
});