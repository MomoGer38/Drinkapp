// ============================================================
//  DRINK & PAY — Spiellogik
//  Vanilla JS, kein Framework erforderlich.
// ============================================================

'use strict';

// ---- Konstanten --------------------------------------------
const STARTING_LIVES = 3;

// ---- Spielzustand ------------------------------------------
let players            = [];   // { name, lives, money }[]
let currentPlayerIndex = 0;    // Index in activePlayers()
let currentTask        = null; // { text, category, level }
let pot                = 0;
let usedTaskIndices    = new Set();

// Kategorie- & Level-Auswahl (Standard: alles aktiv)
let selectedLevels     = new Set([1, 2, 3]);
let selectedCategories = new Set(Object.keys(CATEGORIES));
let filteredTasks      = [];   // wird vor Spielstart befüllt

// ---- DOM-Referenzen ----------------------------------------
const screens = {
    setup:      document.getElementById('screen-setup'),
    categories: document.getElementById('screen-categories'),
    game:       document.getElementById('screen-game'),
    gameover:   document.getElementById('screen-gameover'),
};

const setupEls = {
    input:     document.getElementById('player-name-input'),
    addBtn:    document.getElementById('add-player-btn'),
    list:      document.getElementById('player-list'),
    countInfo: document.getElementById('player-count-info'),
    startBtn:  document.getElementById('start-game-btn'),
};

const catEls = {
    backBtn:     document.getElementById('back-to-setup-btn'),
    grid:        document.getElementById('category-grid'),
    confirmBtn:  document.getElementById('confirm-categories-btn'),
    countInfo:   document.getElementById('task-count-info'),
};

const gameEls = {
    potAmount:       document.getElementById('pot-amount'),
    playerName:      document.getElementById('current-player-name'),
    livesDisplay:    document.getElementById('lives-display'),
    taskCard:        document.getElementById('task-card'),
    taskText:        document.getElementById('task-text'),
    btnDo:           document.getElementById('btn-do-task'),
    btnDoReward:     document.getElementById('btn-do-reward'),
    btnPass:         document.getElementById('btn-pass-task'),
    playersOverview: document.getElementById('players-overview'),
};

const gameoverEls = {
    winnerName:  document.getElementById('winner-name'),
    winnerMoney: document.getElementById('winner-money'),
    scoreboard:  document.getElementById('scoreboard'),
    restartBtn:  document.getElementById('restart-btn'),
};

// ---- Screen-Steuerung --------------------------------------
function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
        el.classList.toggle('active', key === name);
    });
    // Scroll immer nach oben, wenn Screen wechselt
    Object.values(screens).forEach(el => { el.scrollTop = 0; });
}

// ============================================================
//  SCREEN 1 — SETUP
// ============================================================

setupEls.addBtn.addEventListener('click', addPlayer);
setupEls.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPlayer();
});
setupEls.startBtn.addEventListener('click', () => {
    showScreen('categories');
    renderCategoryScreen();
});

function addPlayer() {
    const name = setupEls.input.value.trim();
    if (!name) return;

    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        showToast('Dieser Name existiert bereits.');
        return;
    }

    players.push({ name, lives: STARTING_LIVES, money: 0 });
    setupEls.input.value = '';
    setupEls.input.focus();
    renderPlayerList();
    updateStartButton();
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayerList();
    updateStartButton();
}

function renderPlayerList() {
    setupEls.list.innerHTML = '';
    players.forEach((p, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="player-entry-name">${escapeHtml(p.name)}</span>
            <span class="player-entry-lives">💵 × ${p.lives}</span>
            <button class="remove-btn" aria-label="${escapeHtml(p.name)} entfernen">✕</button>
        `;
        li.querySelector('.remove-btn').addEventListener('click', () => removePlayer(i));
        setupEls.list.appendChild(li);
    });
}

function updateStartButton() {
    const count = players.length;
    setupEls.startBtn.disabled = count < 2;
    if (count === 0) {
        setupEls.countInfo.textContent = 'Mindestens 2 Spieler benötigt';
    } else if (count === 1) {
        setupEls.countInfo.textContent = '1 Spieler – noch mindestens 1 benötigt';
    } else {
        setupEls.countInfo.textContent = `${count} Spieler bereit`;
    }
}

// ============================================================
//  SCREEN 1.5 — KATEGORIEN & SCHWIERIGKEIT
// ============================================================

catEls.backBtn.addEventListener('click', () => showScreen('setup'));
catEls.confirmBtn.addEventListener('click', startGame);

function renderCategoryScreen() {
    // Level-Checkboxen verdrahten
    document.querySelectorAll('.level-toggle input[data-level]').forEach(cb => {
        const lvl = parseInt(cb.dataset.level, 10);
        cb.checked = selectedLevels.has(lvl);
        cb.addEventListener('change', () => {
            if (cb.checked) selectedLevels.add(lvl);
            else             selectedLevels.delete(lvl);
            updateTaskCount();
        });
    });

    // Kategorie-Karten bauen
    catEls.grid.innerHTML = '';
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const card = document.createElement('label');
        card.className = 'category-card' + (selectedCategories.has(key) ? ' active' : '');
        card.innerHTML = `
            <input type="checkbox" ${selectedCategories.has(key) ? 'checked' : ''} data-cat="${escapeHtml(key)}">
            <span class="category-icon">${cat.icon}</span>
            <div class="category-info">
                <span class="category-name">${escapeHtml(cat.label)}</span>
            </div>
            <span class="category-checkmark">✓</span>
        `;
        const cb = card.querySelector('input');
        cb.addEventListener('change', () => {
            if (cb.checked) { selectedCategories.add(key);    card.classList.add('active'); }
            else             { selectedCategories.delete(key); card.classList.remove('active'); }
            updateTaskCount();
        });
        catEls.grid.appendChild(card);
    });

    updateTaskCount();
}

function buildFilteredTasks() {
    return TASKS.filter(t =>
        selectedLevels.has(t.level) && selectedCategories.has(t.category)
    );
}

function updateTaskCount() {
    const count = buildFilteredTasks().length;
    catEls.countInfo.innerHTML = `<strong>${count}</strong> Aufgaben verfügbar`;
    catEls.confirmBtn.disabled = count === 0;
}

// ============================================================
//  SPIELSTART
// ============================================================

function startGame() {
    filteredTasks = buildFilteredTasks();
    if (filteredTasks.length === 0) {
        showToast('Keine Aufgaben ausgewählt!');
        return;
    }

    currentPlayerIndex = 0;
    pot                = 0;
    usedTaskIndices    = new Set();

    // Leben zurücksetzen (nach Neustart)
    players.forEach(p => { p.lives = STARTING_LIVES; p.money = 0; });

    showScreen('game');
    newRound();
}

// ============================================================
//  SCREEN 2 — HAUPTSPIEL
// ============================================================

function activePlayers() {
    return players.filter(p => p.lives > 0);
}

function newRound() {
    currentTask = drawTask();
    renderGameScreen(true);
}

function drawTask() {
    if (usedTaskIndices.size >= filteredTasks.length) {
        usedTaskIndices = new Set();
    }
    let idx;
    do {
        idx = Math.floor(Math.random() * filteredTasks.length);
    } while (usedTaskIndices.has(idx));
    usedTaskIndices.add(idx);
    return filteredTasks[idx];
}

function renderGameScreen(animateCard = false) {
    const active = activePlayers();
    const player = active[currentPlayerIndex];
    if (!player) return;

    // Jackpot
    gameEls.potAmount.textContent = `${pot} €`;

    // Spielername
    gameEls.playerName.textContent = player.name;

    // Aufgaben-Stufen-Badge auf der Karte
    const cat   = CATEGORIES[currentTask.category];
    const lvlColors = { 1: '#22c55e', 2: '#f97316', 3: '#ef4444' };
    gameEls.taskCard.style.borderTopColor = lvlColors[currentTask.level] ?? '#f97316';

    // Leben-Icons
    gameEls.livesDisplay.innerHTML = '';
    for (let i = 0; i < STARTING_LIVES; i++) {
        const icon = document.createElement('span');
        icon.classList.add('life-icon');
        if (i >= player.lives) icon.classList.add('lost');
        icon.textContent = '💵';
        gameEls.livesDisplay.appendChild(icon);
    }

    // Aufgabe
    const levelLabel = ['', '⚡ Stufe 1', '🔥 Stufe 2', '☠️ Stufe 3'][currentTask.level] ?? '';
    gameEls.taskCard.querySelector('.task-label').textContent =
        `${cat ? cat.icon + ' ' + cat.label.toUpperCase() : 'AUFGABE'}  ·  ${levelLabel}`;
    gameEls.taskText.textContent = currentTask.text;

    if (animateCard) {
        gameEls.taskCard.classList.remove('appear');
        void gameEls.taskCard.offsetWidth;
        gameEls.taskCard.classList.add('appear');
    }

    gameEls.btnDoReward.textContent = pot > 0 ? `+ ${pot} € kassieren` : 'Runde gewinnen';
    gameEls.btnPass.disabled = player.lives <= 0;

    renderPlayersOverview(active, player);
}

function renderPlayersOverview(active, currentPlayer) {
    gameEls.playersOverview.innerHTML = '';
    players.forEach((p) => {
        const chip = document.createElement('div');
        chip.classList.add('player-chip');
        if (p === currentPlayer) chip.classList.add('active-player');
        if (p.lives <= 0)        chip.classList.add('eliminated');

        const livesStr = p.lives > 0 ? '💵'.repeat(p.lives) : '☠️';
        chip.innerHTML = `
            <span class="player-chip-name">${escapeHtml(p.name)}</span>
            <span class="player-chip-lives">${livesStr}</span>
        `;
        gameEls.playersOverview.appendChild(chip);
    });
}

// ---- Button: Aufgabe machen --------------------------------
gameEls.btnDo.addEventListener('click', () => {
    const player = activePlayers()[currentPlayerIndex];
    const won    = pot;
    player.money += won;
    pot = 0;

    setActionButtonsEnabled(false);
    const msg = won > 0
        ? `${player.name} kassiert ${won} €! 🎉`
        : `${player.name} erledigt die Aufgabe!`;
    showToast(msg);

    setTimeout(() => {
        advanceToNextPlayer();
        newRound();
        setActionButtonsEnabled(true);
    }, 1200);
});

// ---- Button: Weitergeben -----------------------------------
gameEls.btnPass.addEventListener('click', () => {
    const player = activePlayers()[currentPlayerIndex];
    player.lives -= 1;
    pot          += 10;

    setActionButtonsEnabled(false);

    gameEls.potAmount.classList.remove('bump');
    void gameEls.potAmount.offsetWidth;
    gameEls.potAmount.classList.add('bump');

    if (player.lives <= 0) {
        showToast(`${player.name} ist raus! 💀`);
        setTimeout(() => {
            checkGameOver();
            setActionButtonsEnabled(true);
        }, 1300);
    } else {
        showToast(`${player.name} zahlt 10 € ein. Topf: ${pot} €`);
        setTimeout(() => {
            advanceToNextPlayer();
            renderGameScreen();
            setActionButtonsEnabled(true);
        }, 1000);
    }
});

function advanceToNextPlayer() {
    const count = activePlayers().length;
    if (count === 0) return;
    currentPlayerIndex = (currentPlayerIndex + 1) % count;
}

function checkGameOver() {
    const active = activePlayers();
    if (active.length <= 1) {
        endGame(active[0] ?? null);
        return;
    }
    if (currentPlayerIndex >= active.length) {
        currentPlayerIndex = 0;
    }
    renderGameScreen();
}

function endGame(winner) {
    if (winner) {
        winner.money += pot;
        gameoverEls.winnerName.textContent  = winner.name;
        gameoverEls.winnerMoney.textContent = winner.money > 0
            ? `Hat insgesamt ${winner.money} € kassiert! 🤑`
            : 'Letzter Stehender!';
    } else {
        gameoverEls.winnerName.textContent  = 'Niemand';
        gameoverEls.winnerMoney.textContent = '';
    }

    renderScoreboard(winner);
    showScreen('gameover');
}

// ---- Scoreboard -------------------------------------------
function renderScoreboard(winner) {
    // Alle Spieler nach Geld absteigend sortieren, Ausgeschiedene ans Ende
    const sorted = [...players].sort((a, b) => {
        if (a.lives <= 0 && b.lives > 0) return 1;
        if (b.lives <= 0 && a.lives > 0) return -1;
        return b.money - a.money;
    });

    gameoverEls.scoreboard.innerHTML = '';
    sorted.forEach((p, i) => {
        const row = document.createElement('div');
        const isEliminated = p.lives <= 0 && p !== winner;
        row.className = 'scoreboard-row' +
            (i === 0 && !isEliminated ? ' rank-1' : '') +
            (isEliminated ? ' eliminated' : '');

        const rankStr = isEliminated ? '☠️' : `${i + 1}.`;
        const moneyStr = isEliminated
            ? '— raus'
            : p.money > 0 ? `+ ${p.money} €` : '0 €';

        row.innerHTML = `
            <span class="scoreboard-rank">${rankStr}</span>
            <span class="scoreboard-name">${escapeHtml(p.name)}</span>
            <span class="scoreboard-money">${moneyStr}</span>
        `;
        gameoverEls.scoreboard.appendChild(row);
    });
}

// ---- Neues Spiel -------------------------------------------
gameoverEls.restartBtn.addEventListener('click', () => {
    players            = [];
    pot                = 0;
    currentPlayerIndex = 0;
    usedTaskIndices    = new Set();
    renderPlayerList();
    updateStartButton();
    showScreen('setup');
});

// ---- Buttons sperren / entsperren -------------------------
function setActionButtonsEnabled(enabled) {
    gameEls.btnDo.disabled   = !enabled;
    gameEls.btnPass.disabled = !enabled;
}

// ============================================================
//  HILFSFUNKTIONEN
// ============================================================

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.classList.add('toast');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

function escapeHtml(str) {
    const node = document.createElement('span');
    node.appendChild(document.createTextNode(str));
    return node.innerHTML;
}

'use strict';

// ---- Konstanten --------------------------------------------
const STARTING_LIVES = 3;

// ---- Spielzustand ------------------------------------------
let players            = [];   // { name, lives, money }[]
let currentPlayerIndex = 0;    // Index in activePlayers()
let currentTask        = '';
let pot                = 0;
let usedTaskIndices    = new Set();

// ---- DOM-Referenzen ----------------------------------------
const screens = {
    setup:    document.getElementById('screen-setup'),
    game:     document.getElementById('screen-game'),
    gameover: document.getElementById('screen-gameover'),
};

const setupEls = {
    input:      document.getElementById('player-name-input'),
    addBtn:     document.getElementById('add-player-btn'),
    list:       document.getElementById('player-list'),
    countInfo:  document.getElementById('player-count-info'),
    startBtn:   document.getElementById('start-game-btn'),
};

const gameEls = {
    potAmount:       document.getElementById('pot-amount'),
    playerName:      document.getElementById('current-player-name'),
    livesDisplay:    document.getElementById('lives-display'),
    taskCard:        document.getElementById('task-card'),
    taskText:        document.getElementById('task-text'),
    btnDo:           document.getElementById('btn-do-task'),
    btnDoReward:     document.getElementById('btn-do-reward'),
    btnPass:         document.getElementById('btn-pass-task'),
    playersOverview: document.getElementById('players-overview'),
};

const gameoverEls = {
    winnerName:  document.getElementById('winner-name'),
    winnerMoney: document.getElementById('winner-money'),
    restartBtn:  document.getElementById('restart-btn'),
};

// ---- Screen-Steuerung --------------------------------------
function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
        el.classList.toggle('active', key === name);
    });
}

// ============================================================
//  SCREEN 1 — SETUP
// ============================================================

setupEls.addBtn.addEventListener('click', addPlayer);
setupEls.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPlayer();
});
setupEls.startBtn.addEventListener('click', startGame);

function addPlayer() {
    const name = setupEls.input.value.trim();
    if (!name) return;

    // Kein doppelter Name (case-insensitiv)
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        showToast('Dieser Name existiert bereits.');
        return;
    }

    players.push({ name, lives: STARTING_LIVES, money: 0 });
    setupEls.input.value = '';
    setupEls.input.focus();
    renderPlayerList();
    updateStartButton();
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayerList();
    updateStartButton();
}

function renderPlayerList() {
    setupEls.list.innerHTML = '';
    players.forEach((p, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="player-entry-name">${escapeHtml(p.name)}</span>
            <span class="player-entry-lives">💵 × ${p.lives}</span>
            <button class="remove-btn" aria-label="${escapeHtml(p.name)} entfernen">✕</button>
        `;
        li.querySelector('.remove-btn').addEventListener('click', () => removePlayer(i));
        setupEls.list.appendChild(li);
    });
}

function updateStartButton() {
    const count = players.length;
    setupEls.startBtn.disabled = count < 2;

    if (count === 0) {
        setupEls.countInfo.textContent = 'Mindestens 2 Spieler benötigt';
    } else if (count === 1) {
        setupEls.countInfo.textContent = '1 Spieler – noch mindestens 1 benötigt';
    } else {
        setupEls.countInfo.textContent = `${count} Spieler bereit – Los!`;
    }
}

// ============================================================
//  SPIELSTART
// ============================================================

function startGame() {
    currentPlayerIndex = 0;
    pot                = 0;
    usedTaskIndices    = new Set();
    showScreen('game');
    newRound();
}

// ============================================================
//  SCREEN 2 — HAUPTSPIEL
// ============================================================

/** Alle Spieler mit mindestens 1 Leben. */
function activePlayers() {
    return players.filter(p => p.lives > 0);
}

/** Neue Runde: neue Aufgabe ziehen, rendern. */
function newRound() {
    currentTask = drawTask();
    renderGameScreen(/* animateCard */ true);
}

/** Aufgabe ohne Wiederholung ziehen. */
function drawTask() {
    if (usedTaskIndices.size >= TASKS.length) {
        usedTaskIndices = new Set(); // Pool zurücksetzen
    }
    let idx;
    do {
        idx = Math.floor(Math.random() * TASKS.length);
    } while (usedTaskIndices.has(idx));
    usedTaskIndices.add(idx);
    return TASKS[idx];
}

/** Vollständiges Rendern des Spielbildschirms. */
function renderGameScreen(animateCard = false) {
    const active = activePlayers();
    const player = active[currentPlayerIndex];
    if (!player) return; // Sicherheitsnetz

    // Jackpot
    gameEls.potAmount.textContent = `${pot} €`;

    // Spielername
    gameEls.playerName.textContent = player.name;

    // Leben-Icons
    gameEls.livesDisplay.innerHTML = '';
    for (let i = 0; i < STARTING_LIVES; i++) {
        const icon = document.createElement('span');
        icon.classList.add('life-icon');
        if (i >= player.lives) icon.classList.add('lost');
        icon.textContent = '💵';
        gameEls.livesDisplay.appendChild(icon);
    }

    // Aufgabe
    gameEls.taskText.textContent = currentTask;

    // Aufgabenkarte animieren
    if (animateCard) {
        gameEls.taskCard.classList.remove('appear');
        // Reflow erzwingen, damit die Animation erneut startet
        void gameEls.taskCard.offsetWidth;
        gameEls.taskCard.classList.add('appear');
    }

    // Belohnungs-Label des "Do"-Buttons
    gameEls.btnDoReward.textContent = pot > 0 ? `+ ${pot} € kassieren` : 'Runde gewinnen';

    // Pass-Button deaktivieren wenn keine Leben mehr vorhanden
    gameEls.btnPass.disabled = player.lives <= 0;

    // Spieler-Chips
    renderPlayersOverview(active, player);
}

function renderPlayersOverview(active, currentPlayer) {
    gameEls.playersOverview.innerHTML = '';
    players.forEach((p) => {
        const chip = document.createElement('div');
        chip.classList.add('player-chip');
        if (p === currentPlayer)  chip.classList.add('active-player');
        if (p.lives <= 0)         chip.classList.add('eliminated');

        // Leben als Icon-Wiederholung
        const livesStr = p.lives > 0 ? '💵'.repeat(p.lives) : '☠️';

        chip.innerHTML = `
            <span class="player-chip-name">${escapeHtml(p.name)}</span>
            <span class="player-chip-lives">${livesStr}</span>
        `;
        gameEls.playersOverview.appendChild(chip);
    });
}

// ---- Button: Aufgabe machen --------------------------------
gameEls.btnDo.addEventListener('click', () => {
    const player = activePlayers()[currentPlayerIndex];
    const won    = pot;

    player.money += won;
    pot = 0;

    // Buttons kurz sperren um Doppelklick zu verhindern
    setActionButtonsEnabled(false);

    const msg = won > 0
        ? `${player.name} kassiert ${won} €! 🎉`
        : `${player.name} erledigt die Aufgabe!`;
    showToast(msg);

    setTimeout(() => {
        advanceToNextPlayer();
        newRound();
        setActionButtonsEnabled(true);
    }, 1200);
});

// ---- Button: Weitergeben -----------------------------------
gameEls.btnPass.addEventListener('click', () => {
    const player = activePlayers()[currentPlayerIndex];

    player.lives -= 1;
    pot          += 10;

    setActionButtonsEnabled(false);

    // Jackpot-Bump-Animation
    gameEls.potAmount.classList.remove('bump');
    void gameEls.potAmount.offsetWidth;
    gameEls.potAmount.classList.add('bump');

    if (player.lives <= 0) {
        // Spieler ausgeschieden
        showToast(`${player.name} ist raus! 💀`);
        setTimeout(() => {
            checkGameOver();
            setActionButtonsEnabled(true);
        }, 1300);
    } else {
        showToast(`${player.name} zahlt 10 € ein. Topf: ${pot} €`);
        setTimeout(() => {
            advanceToNextPlayer();
            renderGameScreen(); // gleiche Aufgabe weitergeben
            setActionButtonsEnabled(true);
        }, 1000);
    }
});

/** Index auf den nächsten aktiven Spieler setzen. */
function advanceToNextPlayer() {
    const count = activePlayers().length;
    if (count === 0) return;
    currentPlayerIndex = (currentPlayerIndex + 1) % count;
}

/** Nach einer Ausscheidung prüfen, ob das Spiel vorbei ist. */
function checkGameOver() {
    const active = activePlayers();

    if (active.length <= 1) {
        endGame(active[0] ?? null);
        return;
    }

    // Index in Grenzen halten (falls letzter Spieler ausgeschieden)
    if (currentPlayerIndex >= active.length) {
        currentPlayerIndex = 0;
    }

    // Dieselbe Aufgabe an den nächsten Spieler weitergeben
    renderGameScreen();
}

/** Spiel beenden, Gewinner anzeigen. */
function endGame(winner) {
    if (winner) {
        winner.money += pot; // Rest-Topf geht an den Gewinner
        gameoverEls.winnerName.textContent  = winner.name;
        gameoverEls.winnerMoney.textContent = winner.money > 0
            ? `Hat insgesamt ${winner.money} € gesammelt! 🤑`
            : 'Letzter Stehender!';
    } else {
        gameoverEls.winnerName.textContent  = 'Niemand';
        gameoverEls.winnerMoney.textContent = '';
    }
    showScreen('gameover');
}

// ---- Neues Spiel -------------------------------------------
gameoverEls.restartBtn.addEventListener('click', () => {
    players            = [];
    pot                = 0;
    currentPlayerIndex = 0;
    usedTaskIndices    = new Set();
    renderPlayerList();
    updateStartButton();
    showScreen('setup');
});

// ---- Buttons sperren / entsperren -------------------------
function setActionButtonsEnabled(enabled) {
    gameEls.btnDo.disabled   = !enabled;
    gameEls.btnPass.disabled = !enabled;
}

// ============================================================
//  HILFSFUNKTIONEN
// ============================================================

/** Kurze Info-Meldung als Toast unten einblenden. */
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.classList.add('toast');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

/**
 * Verhindert XSS beim Einfügen von Spielernamen in das DOM.
 * Nutzt den Browser-eigenen Text-Escape statt manueller Ersetzung.
 */
function escapeHtml(str) {
    const node = document.createElement('span');
    node.appendChild(document.createTextNode(str));
    return node.innerHTML;
}
