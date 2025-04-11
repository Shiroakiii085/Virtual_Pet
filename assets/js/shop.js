// assets/js/shop.js
// Shop functionality
function showShop() {
    // Update coins display
    document.getElementById('shopCoins').textContent = gameState.stats.coins;

    // Populate shop tabs
    populateShopTabs();

    // Show first tab by default
    document.querySelector('.shop-tab[data-tab="food"]').click();

    // Show shop modal
    document.getElementById('shopModal').classList.remove('hidden');
}

function populateShopTabs() {
    // Populate Food Tab
    document.getElementById('foodTab').querySelector('.grid').innerHTML = '';
    foodItems.forEach(food => {
        const foodElement = createFoodElement(food);
        document.getElementById('foodTab').querySelector('.grid').appendChild(foodElement);
    });

    // Populate Medicine Tab
    document.getElementById('medicineTab').querySelector('.grid').innerHTML = '';
    medicineItems.forEach(medicine => {
        const medicineElement = createMedicineElement(medicine);
        document.getElementById('medicineTab').querySelector('.grid').appendChild(medicineElement);
    });

    // Populate Minigames Tab
    document.getElementById('lockedMinigames').querySelector('.grid').innerHTML = '';
    document.getElementById('unlockedMinigames').querySelector('.grid').innerHTML = '';

    minigameItems.forEach(minigame => {
        // Check if already unlocked
        if (gameState.minigames[minigame.game].unlocked) {
            const minigameElement = createUnlockedMinigameElement(minigame);
            document.getElementById('unlockedMinigames').querySelector('.grid').appendChild(minigameElement);
        } else {
            const minigameElement = createMinigameElement(minigame);
            document.getElementById('lockedMinigames').querySelector('.grid').appendChild(minigameElement);
        }
    });

    // Populate Toys Tab
    document.getElementById('toysTab').querySelector('.grid').innerHTML = '';
    toyItems.forEach(toy => {
        const toyElement = createToyElement(toy);
        document.getElementById('toysTab').querySelector('.grid').appendChild(toyElement);
    });
}

function createFoodElement(food, count = 0, isFromInventory = false) {
    const canAfford = gameState.stats.coins >= food.price;
    const isPetPreferred = isPetPreferredFood(food.id);

    const foodElement = document.createElement('div');
    foodElement.className = `relative bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm ${(isFromInventory || canAfford) ? 'cursor-pointer hover:shadow' : 'opacity-50'}`;

    // Indicator for pet-preferred food
    if (isPetPreferred) {
        const preferredBadge = document.createElement('div');
        preferredBadge.className = 'absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center';
        preferredBadge.innerHTML = '★';
        foodElement.appendChild(preferredBadge);
    }

    // Food content
    foodElement.innerHTML += `
        <div class="flex flex-col items-center">
            <div class="text-3xl mb-1">${food.img}</div>
            <div class="text-sm font-medium">${food.name}</div>
            <div class="text-xs mt-1 flex items-center">
                ${isFromInventory ?
                `<span class="text-gray-500 dark:text-gray-400">Số lượng: ${count}</span>` :
                `<span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${food.price}
                        </span>`
            }
            </div>
        </div>
    `;

    // Add click handler
    if (isFromInventory) {
        foodElement.addEventListener('click', () => {
            useFood(food.id);
            document.getElementById('foodSelectionModal').classList.add('hidden');
        });
    } else if (canAfford) {
        foodElement.addEventListener('click', () => {
            buyFood(food.id);
        });
    }

    return foodElement;
}

function isPetPreferredFood(foodId) {
    // Check if this food is preferred by the current pet
    const petPreferences = gameState.foodPreferences.find(p => p.type === gameState.selectedPet);
    return petPreferences && petPreferences.preferences.includes(foodId);
}

function createMedicineElement(medicine) {
    const canAfford = gameState.stats.coins >= medicine.price;

    const medicineElement = document.createElement('div');
    medicineElement.className = `bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm ${canAfford ? 'cursor-pointer hover:shadow' : 'opacity-50'}`;

    medicineElement.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="text-3xl mb-1">${medicine.img}</div>
            <div class="text-sm font-medium">${medicine.name}</div>
            <div class="text-xs mt-1 flex flex-col items-center">
                <span class="text-gray-500 dark:text-gray-400 text-center mb-1">${medicine.description}</span>
                <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${medicine.price}
                </span>
            </div>
        </div>
    `;

    // Add click handler
    if (canAfford) {
        medicineElement.addEventListener('click', () => {
            buyMedicine(medicine.id);
        });
    }

    return medicineElement;
}

function createMinigameElement(minigame) {
    const canAfford = gameState.stats.coins >= minigame.price;

    const minigameElement = document.createElement('div');
    minigameElement.className = `bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm ${canAfford ? 'cursor-pointer hover:shadow' : 'opacity-50'}`;

    minigameElement.innerHTML = `
        <div class="flex items-center">
            <div class="text-3xl mr-3">${minigame.img}</div>
            <div class="flex-1">
                <div class="text-sm font-medium">${minigame.name}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${minigame.description}</div>
                <div class="text-xs mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${minigame.price}
                </div>
            </div>
        </div>
    `;

    // Add click handler
    if (canAfford) {
        minigameElement.addEventListener('click', () => {
            buyMinigame(minigame.game);
        });
    }

    return minigameElement;
}

function createUnlockedMinigameElement(minigame) {
    const minigameElement = document.createElement('div');
    minigameElement.className = 'bg-gray-100 dark:bg-gray-700 rounded-lg p-3 shadow-sm';

    minigameElement.innerHTML = `
        <div class="flex items-center">
            <div class="text-3xl mr-3">${minigame.img}</div>
            <div class="flex-1">
                <div class="text-sm font-medium">${minigame.name}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Đã mở khóa</div>
            </div>
        </div>
    `;

    return minigameElement;
}

function createToyElement(toy) {
    const canAfford = gameState.stats.coins >= toy.price;

    const toyElement = document.createElement('div');
    toyElement.className = `bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm ${canAfford ? 'cursor-pointer hover:shadow' : 'opacity-50'}`;

    toyElement.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="text-3xl mb-1">${toy.img}</div>
            <div class="text-sm font-medium">${toy.name}</div>
            <div class="text-xs mt-1 flex flex-col items-center">
                <span class="text-gray-500 dark:text-gray-400 text-center mb-1">${toy.description}</span>
                <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${toy.price}
                </span>
            </div>
        </div>
    `;

    // Add click handler
    if (canAfford) {
        toyElement.addEventListener('click', () => {
            buyToy(toy.id);
        });
    }

    return toyElement;
}

function showFoodSelection() {
    // Populate food list
    populateFoodList();

    // Show food selection modal
    document.getElementById('foodSelectionModal').classList.remove('hidden');
}

function populateFoodList() {
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';

    // Check if there's food in inventory
    if (gameState.inventory.food && gameState.inventory.food.length > 0) {
        // Group food by type to show quantity
        const foodCounts = {};
        gameState.inventory.food.forEach(foodId => {
            foodCounts[foodId] = (foodCounts[foodId] || 0) + 1;
        });

        // Create an element for each food type in inventory
        Object.keys(foodCounts).forEach(foodId => {
            const count = foodCounts[foodId];
            const food = foodItems.find(f => f.id === parseInt(foodId));

            if (food) {
                const foodElement = createFoodElement(food, count, true);
                foodList.appendChild(foodElement);
            }
        });
    } else {
        // No food in inventory
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-span-2 text-center py-6 text-gray-500 dark:text-gray-400';
        emptyMessage.textContent = 'Không có thức ăn trong túi. Mua thức ăn tại Cửa hàng.';
        foodList.appendChild(emptyMessage);
    }
}

function useFood(foodId) {
    // Find the food in inventory
    const foodIndex = gameState.inventory.food.findIndex(f => f === foodId);
    if (foodIndex === -1) return false;

    // Remove food from inventory
    gameState.inventory.food.splice(foodIndex, 1);

    // Get food details
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return false;

    // Check if it's a preferred food for extra happiness
    const isPreferred = isPetPreferredFood(foodId);
    const happinessMultiplier = isPreferred ? 1.5 : 1;

    // Apply food effects
    gameState.stats.hunger = Math.min(100, gameState.stats.hunger + food.hunger);
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + (food.happiness * happinessMultiplier));

    // Check for food quality effect on sickness
    const sickChance = food.risk;
    if (Math.random() < sickChance && !gameState.stats.isSick) {
        // Pet gets sick from low-quality food
        gameState.stats.isSick = true;
        gameState.stats.health = 50; // Start at 50% health
        showToast(`${gameState.petName} bị ốm do ăn thức ăn chất lượng thấp!`, 3000);
        document.getElementById('activePet').classList.remove('pet-bounce', 'pet-shake', 'pet-pulse');
        document.getElementById('activePet').classList.add('pet-sick');
        document.getElementById('healthStatus').classList.remove('hidden');
    }

    // Show food animation
    showFoodAnimation(food);

    // Add XP and love
    addXP(3);
    gameState.stats.love += 1;

    // Update UI
    updateUI();

    // Save game
    if (gameState.settings.autoSave) {
        saveGameState();
    }

    return true;
}

function showFoodAnimation(food) {
    const foodItem = document.getElementById('foodItem');
    const foodContainer = document.getElementById('foodContainer');
    const activePet = document.getElementById('activePet');
    
    // Display food icon
    foodItem.innerHTML = `<div class="text-4xl">${food.img}</div>`;
    foodContainer.classList.remove('hidden');

    // Show pet eating animation
    activePet.classList.add('pet-pulse');
    showEmotion(isPetPreferredFood(food.id) ? '😋' : '🍽️');

    // Hide food after animation
    setTimeout(() => {
        foodContainer.classList.add('hidden');
        activePet.classList.remove('pet-pulse');
    }, 3000);
}

function buyFood(foodId) {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return false;

    // Check if player has enough coins
    if (gameState.stats.coins < food.price) {
        showToast("Không đủ xu để mua!", 2000);
        return false;
    }

    // Deduct coins
    gameState.stats.coins -= food.price;

    // Add to inventory
    if (!gameState.inventory.food) {
        gameState.inventory.food = [];
    }
    gameState.inventory.food.push(foodId);

    // Update UI
    updateUI();
    document.getElementById('shopCoins').textContent = gameState.stats.coins;

    // Show toast
    showToast(`Đã mua ${food.name}!`, 2000);

    // Save game
    if (gameState.settings.autoSave) {
        saveGameState();
    }

    return true;
}

function buyMedicine(medicineId) {
    const medicine = medicineItems.find(m => m.id === medicineId);
    if (!medicine) return false;

    // Check if player has enough coins
    if (gameState.stats.coins < medicine.price) {
        showToast("Không đủ xu để mua!", 2000);
        return false;
    }

    // Check if pet is sick
    if (!gameState.stats.isSick) {
        showToast(`${gameState.petName} không bị ốm!`, 2000);
        return false;
    }

    // Deduct coins
    gameState.stats.coins -= medicine.price;

    // Apply medicine effects
    gameState.stats.health = Math.min(100, gameState.stats.health + medicine.healing);

    // Check if pet is healed
    if (gameState.stats.health >= 100) {
        gameState.stats.isSick = false;
        document.getElementById('activePet').classList.remove('pet-sick');
        document.getElementById('healthStatus').classList.add('hidden');
        showToast(`${gameState.petName} đã khỏi bệnh!`, 3000);
    } else {
        showToast(`Sức khỏe của ${gameState.petName} đã được cải thiện!`, 2000);
    }

    // Show medicine animation
    showMedicineAnimation();

    // Update UI
    updateUI();
    document.getElementById('shopCoins').textContent = gameState.stats.coins;

    // Save game
    if (gameState.settings.autoSave) {
        saveGameState();
    }

    return true;
}

function showMedicineAnimation() {
    const medicineEffect = document.getElementById('medicineEffect');
    medicineEffect.classList.remove('hidden');
    medicineEffect.classList.add('medicine-effect');

    setTimeout(() => {
        medicineEffect.classList.add('hidden');
        medicineEffect.classList.remove('medicine-effect');
    }, 1000);
}

function buyMinigame(gameType) {
    const minigame = minigameItems.find(m => m.game === gameType);
    if (!minigame) return false;

    // Check if player has enough coins
    if (gameState.stats.coins < minigame.price) {
        showToast("Không đủ xu để mua!", 2000);
        return false;
    }

    // Check if already unlocked
    if (gameState.minigames[gameType].unlocked) {
        showToast("Trò chơi này đã được mở khóa!", 2000);
        return false;
    }

    // Deduct coins
    gameState.stats.coins -= minigame.price;

    // Unlock minigame
    gameState.minigames[gameType].unlocked = true;

    // Update UI
    updateUI();
    document.getElementById('shopCoins').textContent = gameState.stats.coins;

    // Show toast
    showToast(`Đã mở khóa trò chơi ${minigame.name}!`, 2000);

    // Refresh shop
    populateShopTabs();

    // Show the new minigame in selection
    if (gameType === 'puzzle') {
        document.getElementById('puzzleGameCard').classList.remove('hidden');
    } else if (gameType === 'race') {
        document.getElementById('raceGameCard').classList.remove('hidden');
    }

    // Save game
    if (gameState.settings.autoSave) {
        saveGameState();
    }

    return true;
}

function buyToy(toyId) {
    const toy = toyItems.find(t => t.id === toyId);
    if (!toy) return false;

    // Check if player has enough coins
    if (gameState.stats.coins < toy.price) {
        showToast("Không đủ xu để mua!", 2000);
        return false;
    }

    // Deduct coins
    gameState.stats.coins -= toy.price;

    // Apply toy effects
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + toy.happiness);

    // Update UI
    updateUI();
    document.getElementById('shopCoins').textContent = gameState.stats.coins;

    // Show toy animation
    showEmotion('🎮');

    // Show toast
    showToast(`${gameState.petName} rất thích món đồ chơi mới!`, 2000);

    // Save game
    if (gameState.settings.autoSave) {
        saveGameState();
    }

    return true;
}