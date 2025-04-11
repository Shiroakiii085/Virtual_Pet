// assets/js/game-state.js
// Game state management
const gameState = {
    selectedPet: null,
    petName: '',
    stats: {
        hunger: 100,
        happiness: 100,
        cleanliness: 100,
        energy: 100,
        health: 100,  // New health stat
        age: 1,
        love: 0,
        xp: 0,
        coins: 50,
        level: 1,
        isSick: false  // New sickness state
    },
    timers: {
        statsInterval: null,
        dayInterval: null,
        autoSaveInterval: null,
        sickInterval: null  // New sickness check interval
    },
    settings: {
        sound: true,
        notification: true,
        gameSpeed: 'normal',
        autoSave: true
    },
    gameTime: {
        day: 1,
        hour: 12,
        minute: 0
    },
    minigames: {
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
    },
    inventory: {
        food: [],
        medicine: [],
        toys: []
    },
    isAsleep: false,
    isPaused: false,
    lastSaved: null,
    // Food preferences by pet type
    foodPreferences: [
        { type: 0, preferences: [0, 6, 7] },  // Cat: Fish, Cat Food, Milk
        { type: 1, preferences: [1, 8, 5] },  // Rabbit: Carrot, Lettuce, Fruit
        { type: 2, preferences: [2, 9, 5] },  // Dinosaur: Meat, Leaves, Fruit
        { type: 3, preferences: [3, 8, 1] },  // Panda: Bamboo, Lettuce, Carrot
        { type: 4, preferences: [4, 10, 2] }, // Dog: Dog Food, Bone, Meat
        { type: 5, preferences: [5, 1, 8] },  // Bird: Fruit, Carrot, Lettuce
        { type: 6, preferences: [6, 0, 7] },  // Fish: Fish Food, Fish, Milk
        { type: 7, preferences: [7, 5, 1] }   // Hamster: Seeds, Fruit, Carrot
    ]
};

// Food items definition
const foodItems = [
    { id: 0, name: "Cá", price: 15, hunger: 20, happiness: 5, img: "🐟", quality: 2, risk: 0.02 },
    { id: 1, name: "Cà rốt", price: 8, hunger: 15, happiness: 3, img: "🥕", quality: 1, risk: 0.01 },
    { id: 2, name: "Thịt", price: 25, hunger: 30, happiness: 5, img: "🍖", quality: 3, risk: 0.03 },
    { id: 3, name: "Măng tre", price: 20, hunger: 25, happiness: 4, img: "🎋", quality: 2, risk: 0.01 },
    { id: 4, name: "Thức ăn cho chó", price: 10, hunger: 20, happiness: 4, img: "🥫", quality: 2, risk: 0.01 },
    { id: 5, name: "Trái cây", price: 12, hunger: 15, happiness: 6, img: "🍎", quality: 2, risk: 0.01 },
    { id: 6, name: "Thức ăn cho cá", price: 5, hunger: 15, happiness: 3, img: "🦐", quality: 1, risk: 0.02 },
    { id: 7, name: "Hạt", price: 7, hunger: 15, happiness: 3, img: "🌰", quality: 1, risk: 0.01 },
    { id: 8, name: "Rau xanh", price: 10, hunger: 20, happiness: 3, img: "🥬", quality: 1, risk: 0.01 },
    { id: 9, name: "Lá cây", price: 5, hunger: 10, happiness: 2, img: "🍃", quality: 1, risk: 0.01 },
    { id: 10, name: "Xương", price: 8, hunger: 10, happiness: 5, img: "🦴", quality: 1, risk: 0.02 },
    { id: 11, name: "Thức ăn cao cấp", price: 30, hunger: 40, happiness: 10, img: "🍱", quality: 3, risk: 0 },
    { id: 12, name: "Bánh thưởng", price: 15, hunger: 10, happiness: 15, img: "🍪", quality: 2, risk: 0.01 }
];

// Medicine items definition
const medicineItems = [
    { id: 0, name: "Thuốc cơ bản", price: 20, healing: 30, img: "💊", description: "Giúp hồi phục 30% sức khỏe" },
    { id: 1, name: "Thuốc kháng sinh", price: 50, healing: 70, img: "💉", description: "Giúp hồi phục 70% sức khỏe" },
    { id: 2, name: "Thuốc toàn diện", price: 100, healing: 100, img: "🧪", description: "Hồi phục 100% sức khỏe" },
    { id: 3, name: "Vitamin", price: 30, healing: 20, img: "🍯", description: "Tăng 20% sức khỏe và giảm nguy cơ bệnh" }
];

// Toy items definition
const toyItems = [
    { id: 0, name: "Bóng", price: 15, happiness: 10, img: "⚽", description: "Tăng 10 điểm vui vẻ" },
    { id: 1, name: "Chuông", price: 20, happiness: 15, img: "🔔", description: "Tăng 15 điểm vui vẻ" },
    { id: 2, name: "Gấu bông", price: 25, happiness: 20, img: "🧸", description: "Tăng 20 điểm vui vẻ" },
    { id: 3, name: "Cần câu cá", price: 30, happiness: 25, img: "🎣", description: "Tăng 25 điểm vui vẻ" }
];

// Minigame items in the shop
const minigameItems = [
    { id: 0, name: "Xếp Hình", price: 100, img: "🧩", description: "Mở khóa trò chơi Xếp Hình", game: "puzzle" },
    { id: 1, name: "Đua Thú Cưng", price: 100, img: "🏁", description: "Mở khóa trò chơi Đua Thú Cưng", game: "race" }
];

// Speed multipliers
const speedMultipliers = {
    slow: 0.5,
    normal: 1,
    fast: 2
};

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Save and Load game state
function saveGameState() {
    if (!isLocalStorageAvailable()) {
        console.log("LocalStorage not available. Cannot save game state.");
        return false;
    }

    try {
        const saveData = {
            selectedPet: gameState.selectedPet,
            petName: gameState.petName,
            stats: gameState.stats,
            settings: gameState.settings,
            gameTime: gameState.gameTime,
            minigames: gameState.minigames,
            inventory: gameState.inventory,
            isAsleep: gameState.isAsleep,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem('virtualPetData', JSON.stringify(saveData));
        gameState.lastSaved = saveData.lastSaved;
        return true;
    } catch (e) {
        console.error("Error saving game state:", e);
        return false;
    }
}

function loadGameState() {
    if (!isLocalStorageAvailable()) {
        console.log("LocalStorage not available. Cannot load game state.");
        return false;
    }

    try {
        const savedData = localStorage.getItem('virtualPetData');
        if (!savedData) return false;

        const data = JSON.parse(savedData);

        // Restore saved data
        gameState.selectedPet = data.selectedPet;
        gameState.petName = data.petName;
        gameState.stats = data.stats || gameState.stats;

        // Ensure health stat exists (for compatibility with old saves)
        if (gameState.stats.health === undefined) {
            gameState.stats.health = 100;
            gameState.stats.isSick = false;
        }

        gameState.settings = data.settings;
        gameState.gameTime = data.gameTime;
        gameState.minigames = data.minigames || gameState.minigames;
        gameState.inventory = data.inventory || gameState.inventory;
        gameState.isAsleep = data.isAsleep;
        gameState.lastSaved = data.lastSaved;

        return true;
    } catch (e) {
        console.error("Error loading game state:", e);
        return false;
    }
}

// Setup auto save
function setupAutoSave() {
    if (gameState.timers.autoSaveInterval) {
        clearInterval(gameState.timers.autoSaveInterval);
    }

    if (gameState.settings.autoSave) {
        gameState.timers.autoSaveInterval = setInterval(() => {
            if (saveGameState()) {
                showToast("Đã tự động lưu", 1500);
            }
        }, 60000); // Save every minute
    }
}