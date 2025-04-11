// assets/js/ui.js
// UI related functions
// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

function showEmotion(emoji) {
    const emotionIcon = document.getElementById('emotionIcon');
    const emotionBubble = document.getElementById('petEmotionBubble');
    
    emotionIcon.textContent = emoji;
    emotionBubble.classList.remove('hidden');

    // Hide after a few seconds
    setTimeout(() => {
        emotionBubble.classList.add('hidden');
    }, 3000);
}

function updateUI() {
    // Update stat bars
    const hungerBar = document.getElementById('hungerBar');
    const happinessBar = document.getElementById('happinessBar'); 
    const cleanlinessBar = document.getElementById('cleanlinessBar');
    const energyBar = document.getElementById('energyBar');
    const healthBar = document.getElementById('healthBar');
    const healthStatus = document.getElementById('healthStatus');
    
    const hungerValue = document.getElementById('hungerValue');
    const happinessValue = document.getElementById('happinessValue');
    const cleanlinessValue = document.getElementById('cleanlinessValue');
    const energyValue = document.getElementById('energyValue');
    const healthValue = document.getElementById('healthValue');
    
    const petLevel = document.getElementById('petLevel');
    const petAge = document.getElementById('petAge');
    const petLove = document.getElementById('petLove');
    const petXp = document.getElementById('petXp');
    const petCoins = document.getElementById('petCoins');
    
    const activePet = document.getElementById('activePet');
    const petStatus = document.getElementById('petStatus');
    const timeDisplay = document.getElementById('timeDisplay');

    hungerBar.style.width = `${gameState.stats.hunger}%`;
    happinessBar.style.width = `${gameState.stats.happiness}%`;
    cleanlinessBar.style.width = `${gameState.stats.cleanliness}%`;
    energyBar.style.width = `${gameState.stats.energy}%`;

    // Update health bar if sick
    if (gameState.stats.isSick) {
        healthBar.style.width = `${gameState.stats.health}%`;
        healthValue.textContent = `${Math.round(gameState.stats.health)}%`;
        healthStatus.classList.remove('hidden');
    } else {
        healthStatus.classList.add('hidden');
    }

    // Update stat values
    hungerValue.textContent = `${Math.round(gameState.stats.hunger)}%`;
    happinessValue.textContent = `${Math.round(gameState.stats.happiness)}%`;
    cleanlinessValue.textContent = `${Math.round(gameState.stats.cleanliness)}%`;
    energyValue.textContent = `${Math.round(gameState.stats.energy)}%`;

    // Update stats display
    petLevel.textContent = `Lv.${gameState.stats.level}`;
    petAge.textContent = gameState.stats.age;
    petLove.textContent = gameState.stats.love;
    petXp.textContent = gameState.stats.xp;
    petCoins.textContent = gameState.stats.coins;

    // Change stat bar colors based on value
    updateStatColors(hungerBar, gameState.stats.hunger);
    updateStatColors(happinessBar, gameState.stats.happiness);
    updateStatColors(cleanlinessBar, gameState.stats.cleanliness);
    updateStatColors(energyBar, gameState.stats.energy);

    // Update health bar color
    if (gameState.stats.isSick) {
        updateStatColors(healthBar, gameState.stats.health);
    }

    // Sleep state
    if (gameState.isAsleep) {
        activePet.style.opacity = '0.7';
        petStatus.textContent = `${gameState.petName} đang chìm trong giấc ngủ!`;
    } else {
        activePet.style.opacity = '1';
    }

    // Update time display
    const hourStr = gameState.gameTime.hour.toString().padStart(2, '0');
    const minuteStr = gameState.gameTime.minute.toString().padStart(2, '0');
    timeDisplay.textContent = `Ngày ${gameState.gameTime.day} - ${hourStr}:${minuteStr}`;

    // Special animation for fish
    if (gameState.selectedPet === 6) { // Fish
        activePet.classList.add('pet-float');
    } else {
        activePet.classList.remove('pet-float');
    }

    // If pet is sick, show animation
    if (gameState.stats.isSick) {
        activePet.classList.add('pet-sick');
    } else {
        activePet.classList.remove('pet-sick');
    }
}

function updateStatColors(bar, value) {
    // Remove all color classes
    bar.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500');

    // Add appropriate color class
    if (value > 70) {
        bar.classList.add('bg-green-500');
    } else if (value > 40) {
        bar.classList.add('bg-yellow-500');
    } else if (value > 20) {
        bar.classList.add('bg-orange-500');
    } else {
        bar.classList.add('bg-red-500');
    }
}

function updateSleepButtonText() {
    const sleepButtonText = document.getElementById('sleepButtonText');
    sleepButtonText.textContent = gameState.isAsleep ? "Đánh thức" : "Ngủ";
}

function updateDayNightCycle() {
    const dayNightCycle = document.getElementById('dayNightCycle');
    const hour = gameState.gameTime.hour;

    // Morning (6-10)
    if (hour >= 6 && hour < 10) {
        dayNightCycle.classList.remove('from-indigo-900', 'from-blue-900');
        dayNightCycle.classList.add('from-blue-300');
        document.documentElement.classList.contains('dark')
            ? dayNightCycle.classList.add('dark:from-indigo-900')
            : dayNightCycle.classList.remove('dark:from-indigo-900');
    }
    // Day (10-17)
    else if (hour >= 10 && hour < 17) {
        dayNightCycle.classList.remove('from-indigo-900', 'from-blue-900');
        dayNightCycle.classList.add('from-blue-300');
        document.documentElement.classList.contains('dark')
            ? dayNightCycle.classList.add('dark:from-indigo-900')
            : dayNightCycle.classList.remove('dark:from-indigo-900');
    }
    // Evening (17-21)
    else if (hour >= 17 && hour < 21) {
        dayNightCycle.classList.remove('from-blue-300', 'from-indigo-900');
        dayNightCycle.classList.add('from-blue-900');
        document.documentElement.classList.contains('dark')
            ? dayNightCycle.classList.add('dark:from-indigo-900')
            : dayNightCycle.classList.remove('dark:from-indigo-900');
    }
    // Night (21-6)
    else {
        dayNightCycle.classList.remove('from-blue-300', 'from-blue-900');
        dayNightCycle.classList.add('from-indigo-900');
        document.documentElement.classList.contains('dark')
            ? dayNightCycle.classList.add('dark:from-indigo-900')
            : dayNightCycle.classList.remove('dark:from-indigo-900');
    }
}

function checkPetMood() {
    const petStatus = document.getElementById('petStatus');
    
    // Calculate overall mood based on stats average
    const overallMood = (
        gameState.stats.hunger +
        gameState.stats.happiness +
        gameState.stats.cleanliness +
        gameState.stats.energy +
        (gameState.stats.isSick ? gameState.stats.health : 100) // Include health if sick
    ) / (gameState.stats.isSick ? 5 : 4); // Adjust divisor

    if (gameState.stats.isSick) {
        petStatus.textContent = `${gameState.petName} đang bị ốm!`;
        showEmotion('🤒');
    } else if (overallMood < 20) {
        petStatus.textContent = `${gameState.petName} đang rất buồn :(`;
        showEmotion('😢');
    } else if (overallMood < 40) {
        petStatus.textContent = `${gameState.petName} không được vui lắm :<`;
        showEmotion('😞');
    } else if (overallMood < 60) {
        petStatus.textContent = `${gameState.petName} cảm thấy bình thường :)`;
        showEmotion('😐');
    } else if (overallMood < 80) {
        petStatus.textContent = `${gameState.petName} đang vui =))`;
        showEmotion('😊');
    } else {
        petStatus.textContent = `${gameState.petName} đang rất hạnh phúc :3`;
        showEmotion('😄');
    }

    // Check individual critical stats
    if (gameState.stats.hunger <= 60) {
        petStatus.textContent = `${gameState.petName} hơi hơi đói rồi đó :3`;
        showEmotion('🍽️');
    }
    if (gameState.stats.hunger <= 40) {
        petStatus.textContent = `${gameState.petName} đói lắm rồi đó :<`;
        showEmotion('😟');
    }

    if (gameState.stats.hunger <= 10) {
        petStatus.textContent = `${gameState.petName} sắp đói chết rồi :((`;
        showEmotion('😩');
    }

    if (gameState.stats.energy <= 30) {
        petStatus.textContent = `${gameState.petName} cảm thấy mệt mỏi :<`;
        showEmotion('😴');
    }

    if (gameState.stats.energy <= 10) {
        petStatus.textContent = `${gameState.petName} cần đi ngủ ngay bây giờ "-"`;
        showEmotion('😴');
    }

    if (gameState.stats.cleanliness <= 30) {
        petStatus.textContent = `${gameState.petName} cần đi tắm :<`;
    }

    if (gameState.stats.cleanliness <= 10) {
        petStatus.textContent = `${gameState.petName} đang quá bẩn cần đi tắm ngay!`;
        showEmotion('🧼');
    }
}

function addXP(amount) {
    gameState.stats.xp += amount;
    checkLevelUp();

    // Update XP display
    document.getElementById('petXp').textContent = gameState.stats.xp;
}

function checkLevelUp() {
    // Level up if XP reaches 100
    if (gameState.stats.xp >= 100) {
        gameState.stats.level++;
        gameState.stats.xp = gameState.stats.xp - 100;

        // Level up rewards
        gameState.stats.coins += 20;

        // Show level up message
        document.getElementById('petStatus').textContent = `${gameState.petName} đã lên cấp ${gameState.stats.level}!`;
        showEmotion('🌟');

        // Update level display
        document.getElementById('petLevel').textContent = `Lv.${gameState.stats.level}`;

        // Display toast
        showToast(`${gameState.petName} đã lên cấp ${gameState.stats.level}!`, 3000);
    }
}

// Helper function for arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}