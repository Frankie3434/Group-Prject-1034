document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("splash-screen").style.display = "none";
  
    document.getElementById("game-container").style.display = "block";
  
    sessionStorage.setItem("playingRockPaperScissors",true);
  });

let you;
let yourScore = 0;
let opponent;
let opponentScore = 0;
let commentText = document.getElementById("comment-text");

let choices = ["rock", "paper", "scissors"];
let choice;
let createdChoices = [];


window.onload = function() {
    for(let i=0;i<3;i++)
    {
        let choice = document.createElement("img");
        choice.id = choices[i];
        choice.src = "./img/" + choices[i] + ".png";
        choice.addEventListener("click", selectChoice);
        document.getElementById("choices").append(choice); 

        createdChoices.push(choice);
    }
}

function selectChoice() {
    you = this.id;
    document.getElementById("your-choice").src = "./img/" + you + ".png";


    opponent = choices[Math.floor(Math.random() * 3)];
    document.getElementById("opponent-choice").src = "./img/" + opponent + ".png";

    if(you == opponent)
    {
        commentText.innerText = "Draw";
    }

    else
    {
        if(you == "rock")
        {
            if(opponent == "scissors")
            {
                yourScore++;
                commentText.innerText = "You gained a point";
            }

            else
            {
                opponentScore++;
                commentText.innerText = "Your opponent gained a point";
            }
        }

        else if(you == "scissors")
        {
            if(opponent == "paper")
            {
                yourScore++;
                commentText.innerText = "You gained a point";
            }

            else
            {
                opponentScore++;
                commentText.innerText = "Your opponent gained a point";
            }
        }

        else if(you == "paper")
        {
            if(opponent == "rock")
            {
                yourScore++;
                commentText.innerText = "You gained a point";
            }

            else
            {
                opponentScore++;
                commentText.innerText = "Your opponent gained a point";
            }
        }
    }

    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("opponent-score").innerText = opponentScore;

    if(yourScore == 5)
    {
        endGame(true);
    }

    if(opponentScore == 5)
    {
        endGame(false);
    }


}

function endGame(playerWins) {
    createdChoices.forEach(choice => {
        choice.removeEventListener("click", selectChoice);
    });

    if(playerWins)
    {
        commentText.innerText = "You won!";
        sessionStorage.setItem("rockPaperScissorsWon", "true");
    }

    else
    {
        commentText.innerText = "You lose!";
        sessionStorage.setItem("rockPaperScissorsWon", "false");
    }
    let btn = document.createElement("button");
    btn.textContent = "Go Back";
    btn.id = "goBackBtn";

    btn.onclick = () => {window.location.href = "game.html"};
    let game = document.getElementById("game-container");
    game.appendChild(btn);
}


