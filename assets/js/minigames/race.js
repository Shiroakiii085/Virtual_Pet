// assets/js/minigames/race.js
// Race Game Variables
let raceActive = false;
let raceInterval = null;
let raceRoundNum = 1;
let racersPositions = [];
let playerPosition = 0;
let boostAvailable = 100;
let boostCooldown = false;

const RACE_MAX_POSITION = 100; // % of track width

function initRaceGame() {
    const startRace = document.getElementById('startRace');
    
    if (raceActive) return;

    // Reset race state
    raceActive = true;
    raceRoundNum = 1;
    racersPositions = [0, 0, 0, 0]; // Player + 3 NPCs
    playerPosition = 0;
    boostAvailable = 100;
    boostCooldown = false;

    // Setup pet racers
    setupRacers();

    // Update UI
    document.getElementById('raceRound').textContent = raceRoundNum;
    document.getElementById('racePosition').textContent = '?';
    document.getElementById('boostBar').style.width = '100%';
    document.getElementById('boostButton').disabled = false;

    // Start the race!
    startRace.textContent = 'Đang đua...';
    startRace.disabled = true;
    startRace.classList.add('opacity-50');

    // Ready, set, go countdown
    showToast('Chuẩn bị...', 1000);

    setTimeout(() => {
        showToast('Sẵn sàng...', 1000);

        setTimeout(() => {
            showToast('Bắt đầu!', 1000);
            startRaceLoop();
        }, 1000);
    }, 1000);
}

function setupRacers() {
    // Setup player pet
    const drawPlayerPet = getPetDrawFunction(gameState.selectedPet);
    drawPlayerPet(document.getElementById('playerPet'));
    document.getElementById('playerPet').style.left = '4px';

    // Setup NPC pets (using different pet drawings)
    const availablePets = Array.from({ length: 8 }, (_, i) => i);
    const filteredPets = availablePets.filter(p => p !== gameState.selectedPet);

    // Shuffle and pick 3
    shuffleArray(filteredPets);
    const npcPets = filteredPets.slice(0, 3);

    const drawNPC1 = getPetDrawFunction(npcPets[0]);
    const drawNPC2 = getPetDrawFunction(npcPets[1]);
    const drawNPC3 = getPetDrawFunction(npcPets[2]);

    drawNPC1(document.getElementById('npcPet1'));
    drawNPC2(document.getElementById('npcPet2'));
    drawNPC3(document.getElementById('npcPet3'));

    document.getElementById('npcPet1').style.left = '4px';
    document.getElementById('npcPet2').style.left = '4px';
    document.getElementById('npcPet3').style.left = '4px';
}

function startRaceLoop() {
    raceInterval = setInterval(() => {
        updateRace();
        updateRaceUI();

        // Check if current round has finished
        if (isRoundFinished()) {
            endRaceRound();
        }
    }, 100);
}

function updateRace() {
    // Calculate speeds for each racer 
    // Player has slightly better base speed
    const playerSpeed = 0.6 + (Math.random() * 0.4);
    const npc1Speed = 0.5 + (Math.random() * 0.5);
    const npc2Speed = 0.5 + (Math.random() * 0.5);
    const npc3Speed = 0.5 + (Math.random() * 0.5);

    // Update positions
    racersPositions[0] += playerSpeed;
    racersPositions[1] += npc1Speed;
    racersPositions[2] += npc2Speed;
    racersPositions[3] += npc3Speed;

    // Update player position tracking
    playerPosition = racersPositions[0];

    // Recover boost slowly
    if (!boostCooldown && boostAvailable < 100) {
        boostAvailable = Math.min(100, boostAvailable + 0.2);
        document.getElementById('boostBar').style.width = `${boostAvailable}%`;
    }
}

function updateRaceUI() {
    const raceTrack = document.getElementById('raceTrack');
    
    // Update racer positions on screen
    const trackWidth = raceTrack.offsetWidth - 70; // Account for pet width

    document.getElementById('playerPet').style.left = `${(racersPositions[0] / RACE_MAX_POSITION) * trackWidth + 4}px`;
    document.getElementById('npcPet1').style.left = `${(racersPositions[1] / RACE_MAX_POSITION) * trackWidth + 4}px`;
    document.getElementById('npcPet2').style.left = `${(racersPositions[2] / RACE_MAX_POSITION) * trackWidth + 4}px`;
    document.getElementById('npcPet3').style.left = `${(racersPositions[3] / RACE_MAX_POSITION) * trackWidth + 4}px`;

    // Update player's position rank
    const ranking = getRacePositions();
    const playerRank = ranking.findIndex(pos => pos === 0) + 1;
    document.getElementById('racePosition').textContent = playerRank;
}

function getRacePositions() {
    // Get sorted positions (indexes) from highest to lowest
    return racersPositions
        .map((pos, idx) => ({ pos, idx }))
        .sort((a, b) => b.pos - a.pos)
        .map(item => item.idx);
}

function isRoundFinished() {
    // Check if any racer has finished
    return racersPositions.some(pos => pos >= RACE_MAX_POSITION);
}

function useBoost() {
    if (boostCooldown || boostAvailable < 20 || !raceActive) return;

    // Apply boost to player
    racersPositions[0] += 10;

    // Reduce available boost
    boostAvailable = Math.max(0, boostAvailable - 20);
    document.getElementById('boostBar').style.width = `${boostAvailable}%`;

    // Apply cooldown
    boostCooldown = true;
    document.getElementById('boostButton').disabled = true;

    // Reset cooldown after 2 seconds
    setTimeout(() => {
        boostCooldown = false;
        if (boostAvailable > 0) {
            document.getElementById('boostButton').disabled = false;
        }
    }, 2000);
}

function endRaceRound() {
    clearInterval(raceInterval);

    // Get final positions
    const finalRanking = getRacePositions();
    const playerRank = finalRanking.findIndex(pos => pos === 0) + 1;

    // Show round result
    showToast(`Kết thúc vòng ${raceRoundNum}: Vị trí ${playerRank}`, 2000);

    // Check if the race is complete (3 rounds)
    if (raceRoundNum >= 3) {
        endRace(playerRank);
    } else {
        // Setup next round
        setTimeout(() => {
            raceRoundNum++;

            // Reset positions but keep score differential
            // Player gets slight advantage for good performance
            const playerBonus = playerRank === 1 ? 5 : playerRank === 2 ? 3 : 0;

            racersPositions = [playerBonus, 0, 0, 0];

            // Reset UI
            const raceTrack = document.getElementById('raceTrack');
            document.getElementById('playerPet').style.left = `${(playerBonus / RACE_MAX_POSITION) * (raceTrack.offsetWidth - 70) + 4}px`;
            document.getElementById('npcPet1').style.left = '4px';
            document.getElementById('npcPet2').style.left = '4px';
            document.getElementById('npcPet3').style.left = '4px';

            document.getElementById('raceRound').textContent = raceRoundNum;

            // Start next round
            showToast(`Bắt đầu vòng ${raceRoundNum}!`, 1000);
            startRaceLoop();
        }, 2000);
    }
}

function endRace(finalRank) {
    raceActive = false;

    // Count wins
    if (finalRank === 1) {
        gameState.minigames.race.wins++;
    }

    // Increment play count
    gameState.minigames.race.playCount++;

    // Calculate rewards based on final position
    const rankXP = finalRank === 1 ? 30 : finalRank === 2 ? 20 : finalRank === 3 ? 10 : 5;

    // Apply sick penalty if applicable
    let xpGain = rankXP;
    if (gameState.stats.isSick) {
        xpGain = Math.floor(xpGain * 0.5); // 50% penalty
        showToast("Thú cưng đang bị ốm, thưởng giảm 50%", 3000);
    }

    gameState.stats.xp += xpGain;
    gameState.stats.happiness = Math.min(100, gameState.stats.happiness + 15);
    gameState.stats.energy = Math.max(0, gameState.stats.energy - 15);
    gameState.stats.hunger = Math.max(0, gameState.stats.hunger - 10); // Reduced hunger
    gameState.stats.cleanliness = Math.max(0, gameState.stats.cleanliness - 7); // Reduced cleanliness

    updateUI();
    checkLevelUp();

    // Reset for next race
    document.getElementById('startRace').textContent = 'Bắt đầu đua';
    document.getElementById('startRace').disabled = false;
    document.getElementById('startRace').classList.remove('opacity-50');

    // Show race result
    const resultMessage = finalRank === 1 ? "Vô địch!" :
        finalRank === 2 ? "Á quân!" :
            finalRank === 3 ? "Hạng ba!" :
                "Hạng tư";

    showToast(`Kết quả cuộc đua: ${resultMessage} XP +${xpGain}`, 3000);

    // Save game after minigame
    saveGameState();
}