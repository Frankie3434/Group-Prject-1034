let deck = [];
let playerHand = [];
let dealerHand = [];
let gameResult = false;

function initializeDeck() {
    const suits = ["♠", "♣", "♥", "♦"];
    const values = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card.value === "A") return 11;
    if (["K", "Q", "J"].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === "A") aces++;
        sum += getCardValue(card);
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

function startGame() {
    initializeDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateUI();
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hit() {
    const card = deck.pop();
    playerHand.push(card);
    updateUI();

    if (calculateHand(playerHand) > 21) {
        disableButtons();
        await delay(2000); // Wait 2 seconds before showing bust message
        endGame(false);
        return false;
    }
}

async function stand() {
    while (calculateHand(dealerHand) < 17) {
        const card = deck.pop();
        dealerHand.push(card);
        updateUI();
        await delay(500); // Show each dealer card draw for 500ms
    }

    let playerSum = calculateHand(playerHand);
    let dealerSum = calculateHand(dealerHand);

    if (dealerSum > 21 || playerSum > dealerSum) {
        endGame(true);
        return true;
    } else {
        endGame(false);
        return false;
    }
}

function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}

function endGame(playerWins) {
    gameResult = playerWins;
    alert(playerWins ? "You win!" : "You lose!");
    if (!playerWins && calculateHand(playerHand) > 21) {
        // Keep buttons disabled if player busted
        disableButtons();
    }
    return playerWins;
}

function updateUI() {
    document.getElementById("player-sum").textContent =
        calculateHand(playerHand);
    document.getElementById("dealer-sum").textContent =
        calculateHand(dealerHand);

    document.getElementById("player-cards").textContent = playerHand
        .map((card) => `${card.value}${card.suit}`)
        .join(" ");
    document.getElementById("dealer-cards").textContent = dealerHand
        .map((card) => `${card.value}${card.suit}`)
        .join(" ");
}

// Update event listeners to handle async functions
document.getElementById("hit").addEventListener("click", () => {
    if (gameResult) return; // Prevent actions if game is over
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    hit().finally(() => {
        if (!gameResult) {
            // Only re-enable if game isn't over
            document.getElementById("hit").disabled = false;
            document.getElementById("stand").disabled = false;
        }
    });
});

document.getElementById("stand").addEventListener("click", () => {
    if (gameResult) return; // Prevent actions if game is over
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    stand().finally(() => {
        if (!gameResult) {
            // Only re-enable if game isn't over
            document.getElementById("hit").disabled = false;
            document.getElementById("stand").disabled = false;
        }
    });
});

// Start game on load
startGame();
