// adjust these to make game harder or easier
const RowCount = 6;
const ColCount = 6;
const numMines = 3;
let Countsafe = (RowCount * ColCount)- numMines;
let gameOver = false;
let ended = 0;


// Game Timer code
// change countdown to change time allowed for game
let countdown = 35;
let timerElement = document.getElementById("timer");

const timer = setInterval(function()
{
    countdown--;
    console.log(countdown);
    timerElement.innerHTML = countdown + "s";
    if (countdown === 0) {
        clearInterval(timer);
        console.log("Time's up!");
        timerElement.innerHTML = "Time's Up! Accusation Failed.";
        sessionStorage.setItem("energy", parseInt(sessionStorage.getItem("energy")) - 1);

        // log the accusation
        let accusationArr = JSON.parse(sessionStorage.getItem("accusationsArr"));
        let accusationDetails = sessionStorage.getItem("accusedCharacter") +  "_0";
        accusationArr.push(accusationDetails);
        sessionStorage.setItem("accusationsArr", JSON.stringify(accusationArr));


        let btn = document.createElement("button");
        btn.textContent = "Go Back";
        btn.style.display = "block";
        btn.style.margin = "0 auto";
        sessionStorage.setItem("accusedCharacter", 0);
        btn.onclick = () => {sessionStorage.setItem("newGame", false); window.location.href = "game.html"};
        let game = document.getElementById("bottom-item");
        game.appendChild(btn);
        gameOver=true;
    }
} , 1000);


// game code
const gameGrid = document.getElementById("gameGrid");
let board = [];

function initializeBoard() 
{
    for (let i = 0; i < RowCount; i++) 
    {
        board[i] = [];
        for (let j = 0; j < ColCount; j++) 
        {
            board[i][j] = { isMine: false, revealed: false, count: 0 };
        }
    }

    // Place mines randomly
    let minesPlaced = 0;
    ended = 0;
    while (minesPlaced < numMines) 
    {
        const row = Math.floor(Math.random() * RowCount);
        const col = Math.floor(Math.random() * ColCount);
        if (!board[row][col].isMine) 
        {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate counts
    for (let i = 0; i < RowCount; i++) 
    {
        for (let j = 0;j < ColCount;j++) 
        {
            if (!board[i][j].isMine) 
            {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) 
                {
                    for (let dy = -1;dy <= 1;dy++) 
                    {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < RowCount && nj >= 0 && nj < ColCount&& board[ni][nj].isMine) 
                        {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
}

function revealCell(row, col) 
{
    if (row < 0 || row >= RowCount || col < 0 || col >= ColCount || board[row][col].revealed || gameOver) 
    {
        return;
    }
    board[row][col].revealed = true;
    Countsafe --;
    if (board[row][col].isMine) 
    {
        // Handle game over
        gameGrid.style.visibility = "hidden";
        clearInterval(timer);
        timerElement.innerHTML = "You Misspoke. Accusation Failed";
        sessionStorage.setItem("energy", parseInt(sessionStorage.getItem("energy")) - 1);

        // log the accusation
        let accusationArr = JSON.parse(sessionStorage.getItem("accusationsArr"));
        let accusationDetails = sessionStorage.getItem("accusedCharacter") +  "_0";
        accusationArr.push(accusationDetails);
        sessionStorage.setItem("accusationsArr", JSON.stringify(accusationArr));


        let btn = document.createElement("button");
        btn.textContent = "Go Back";
        btn.style.display = "block";
        btn.style.margin = "0 auto";
        sessionStorage.setItem("accusedCharacter", 0);
        btn.onclick = () => {sessionStorage.setItem("newGame", false); window.location.href = "game.html"};
        let game = document.getElementById("bottom-item");
        game.appendChild(btn);
        //alert("Game Over! You stepped on a mine.");
        gameOver = true;
        Countsafe ++;


    } 
    else if (board[row][col].count === 0) 
    {
        // If cell has no mines nearby,
        // Reveal adjacent cells
        for (let dx = -1;dx <= 1;dx++) 
        {
            for (let dy = -1;dy <= 1;dy++) 
            {
                revealCell(row + dx,col + dy);
            }
        }
    }
    renderBoard();
}

function renderBoard() 
{
    gameGrid.innerHTML = "";

    for (let i = 0; i < RowCount; i++) 
    {
        for (let j = 0; j < ColCount; j++) 
        {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (board[i][j].revealed) 
            {
                cell.classList.add("revealed");
                if (board[i][j].isMine) 
                {
                    cell.classList.add("mine");
                    cell.textContent = "X";
                } 
                else if (board[i][j].count >0) 
                {
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener(
                "click",
                () => revealCell(i, j)
            );
            gameGrid.appendChild(cell);
        }
        gameGrid.appendChild(
            document.createElement("br")
        );
    }

    if(Countsafe<=0)
    {
        if(ended ==0)
        {
            ended ++;
            gameGrid.style.visibility = "hidden";
            clearInterval(timer);
            timerElement.innerHTML = "Successful Accusation!";
    
            sessionStorage.setItem("energy", parseInt(sessionStorage.getItem("energy")) - 1);
    
            // log the accusation
            let accusationArr = JSON.parse(sessionStorage.getItem("accusationsArr"));
            let accusationDetails = sessionStorage.getItem("accusedCharacter") +  "_1";
            accusationArr.push(accusationDetails);
            sessionStorage.setItem("accusationsArr", JSON.stringify(accusationArr));
    
    
            let btn = document.createElement("button");
            btn.textContent = "Continue";
            btn.style.display = "block";
            btn.style.margin = "0 auto";
            btn.onclick = () => {sessionStorage.setItem("newGame", false); window.location.href = "game.html"};
            let game = document.getElementById("bottom-item");
            game.appendChild(btn);
        }

    }

    
}

// Toggle menu popup
function toggleMenu() {
    const menuPopup = document.getElementById("menu-popup");
    menuPopup.style.display =
        menuPopup.style.display === "none" ? "block" : "none";
}

// Close load popup
function closeLoadPopup() {
    const loadPopup = document.getElementById("load-popup");
    loadPopup.style.display = "none";
}

// Quit to main menu
function quitToMainMenu() {
    window.location.href = "landing.html";
}


initializeBoard();
renderBoard();
