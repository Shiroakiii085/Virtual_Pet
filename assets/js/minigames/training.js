// assets/js/minigames/training.js
// Training Game Variables
let trainingActive = false;
let currentCommand = null;
let commandTimer = null;
let trainingScore = 0;
let commandsIssued = 0;

function initTrainingGame() {
    if (trainingActive) return;

    // Start training
    trainingActive = true;
    trainingScore = 0;
    commandsIssued = 0;

    document.getElementById('trainingCommand').textContent = 'Sẵn sàng...';
    document.getElementById('trainingInstructions').textContent = 'Quan sát và đợi lệnh!';

    document.getElementById('startTraining').textContent = 'Đang huấn luyện...';
    document.getElementById('startTraining').disabled = true;
    document.getElementById('startTraining').classList.add('opacity-50');

    // Draw pet for training
    const drawPetFunc = getPetDrawFunction(gameState.selectedPet);
    drawPetFunc(document.getElementById('trainingPet'));

    // Start issuing commands after a delay
    setTimeout(issueCommand, 2000);
}

function issueCommand() {
    if (!trainingActive) return;

    const commands = ['sit', 'roll', 'jump'];
    currentCommand = commands[Math.floor(Math.random() * commands.length)];

    let commandText = '';
    switch (currentCommand) {
        case 'sit': commandText = 'Ngồi xuống!'; break;
        case 'roll': commandText = 'Lăn tròn!'; break;
        case 'jump': commandText = 'Nhảy lên!'; break;
    }

    document.getElementById('trainingCommand').textContent = commandText;
    document.getElementById('trainingCommand').classList.add('text-primary', 'animate-pulse');
    document.getElementById('trainingInstructions').textContent = 'Nhấn nút lệnh đúng!';

    // Set a timer for response
    clearTimeout(commandTimer);
    commandTimer = setTimeout(() => {
        // Time's up
        document.getElementById('trainingCommand').textContent = 'Quá chậm!';
        document.getElementById('trainingCommand').classList.remove('text-primary', 'animate-pulse');
        document.getElementById('trainingCommand').classList.add('text-red-500');

        endCommandRound(false);
    }, 3000);

    commandsIssued++;
}

function checkCommand(command) {
    clearTimeout(commandTimer);

    if (command === currentCommand) {
        // Correct command
        trainingScore++;
        document.getElementById('trainingCommand').textContent = 'Chính xác!';
        document.getElementById('trainingCommand').classList.remove('text-primary', 'animate-pulse');
        document.getElementById('trainingCommand').classList.add('text-green-500');

        // Show animation based on command
        const trainingPet = document.getElementById('trainingPet');
        switch (command) {
            case 'sit':
                trainingPet.classList.add('transform', 'scale-y-75', 'translate-y-2');
                setTimeout(() => {
                    trainingPet.classList.remove('transform', 'scale-y-75', 'translate-y-2');
                }, 1000);
                break;
            case 'roll':
                trainingPet.classList.add('animate-spin');
                setTimeout(() => {
                    trainingPet.classList.remove('animate-spin');
                }, 1000);
                break;
            case 'jump':
                trainingPet.classList.add('animate-bounce');
                setTimeout(() => {
                    trainingPet.classList.remove('animate-bounce');
                }, 1000);
                break;
        }

        endCommandRound(true);
    } else {
        // Wrong command
        document.getElementById('trainingCommand').textContent = 'Sai rồi!';
        document.getElementById('trainingCommand').classList.remove('text-primary', 'animate-pulse');
        document.getElementById('trainingCommand').classList.add('text-red-500');

        endCommandRound(false);
    }
}

function endCommandRound(success) {
    setTimeout(() => {
        document.getElementById('trainingCommand').classList.remove('text-green-500', 'text-red-500');

        // Check if we should end the game
        if (commandsIssued >= 10) {
            endTrainingGame();
        } else {
            // Issue next command
            issueCommand();
        }
    }, 1500);
}

function endTrainingGame() {
    trainingActive = false;
    currentCommand = null;

    // Calculate percentage score
    const percentage = Math.floor((trainingScore / 10) * 100);

    // Update stats
    if (trainingScore > gameState.minigames.training.commandsLearned) {
        gameState.minigames.training.commandsLearned = trainingScore;
    }

    // Increment play count
    gameState.minigames.training.playCount++;

    // Apply sick penalty if applicable
    let xpGain = Math.floor(trainingScore * 2.5); // Up to 25 XP for perfect score
    if (gameState.stats.isSick) {
        xpGain = Math.floor(xpGain * 0.5); // 50% penalty
        showToast("Thú cưng đang bị ốm, thưởng giảm 50%", 3000);
    }

    gameState.stats.xp += xpGain;
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 10);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 12);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 8); // Reduced hunger
    gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - 5); // Reduced cleanliness

    // If score is 8 or better, give love points
    if (trainingScore >= 8) {
        gameState.stats.love += 2;
    }

    updateUI();
    checkLevelUp();

    // Display results
    document.getElementById('trainingCommand').textContent = `Huấn luyện hoàn thành!`;
    document.getElementById('trainingInstructions').textContent = `Điểm: ${trainingScore}/10 (${percentage}%)`;

    document.getElementById('startTraining').textContent = 'Huấn luyện lại';
    document.getElementById('startTraining').disabled = false;
    document.getElementById('startTraining').classList.remove('opacity-50');

    showToast(`Kết thúc huấn luyện! Điểm: ${trainingScore}/10, XP +${xpGain}`);

    // Save game after minigame
    saveGameState();
}

// Set up training button event listeners
document.addEventListener('DOMContentLoaded', function() {
    const trainingButtons = document.querySelectorAll('.training-btn');
    
    trainingButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!trainingActive || !currentCommand) return;

            const command = button.getAttribute('data-command');
            checkCommand(command);
        });
    });
});