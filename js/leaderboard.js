let container = document.getElementById("resultsContainer");
const buttons = document.querySelectorAll(".btn-leaderboard");

buttons.forEach(button => {
    button.addEventListener("click", async (e) => {
        buttons.forEach((btn) => {
            btn.classList.remove("button-active");
        });
        button.classList.add("button-active");
    });
});

//Get Player Information
async function getPlayerInfo() {
    sqlQuery = `SELECT u.Username, TotalGames FROM USER u ORDER BY TotalGames DESC`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Games Played</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].TotalGames !== undefined ? result.data[i].TotalGames : 0} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving player information: " + result.error);
            return "Error retrieving player information.";
        }
}

/// Get Total Wins
async function getTotalWins() {
    console.log("Getting player information...");
    sqlQuery = `SELECT u.Username, COUNT(g.GameID) as TotalWins FROM USER u LEFT JOIN GAME g ON u.UserID = g.UserID WHERE g.Ending = 1 GROUP BY g.UserId ORDER BY TotalWins DESC`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Total Wins</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].TotalWins !== undefined ? result.data[i].TotalWins : 0} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving Total Wins information: " + result.error);
            return "Error retrieving player information.";
        }
}

/// Get Total Losses
async function getTotalLosses() {
    console.log("Getting player information...");
    sqlQuery = `SELECT u.Username, COUNT(g.GameID) as TotalLosses FROM USER u LEFT JOIN GAME g ON u.UserID = g.UserID WHERE g.Ending IN (2, 3) GROUP BY g.UserID ORDER BY TotalLosses DESC`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Total Losses</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].TotalLosses !== undefined ? result.data[i].TotalLosses : 0} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving Total Losses information: " + result.error);
            return "Error retrieving player information.";
        }
}

/// Get Game Win Completion Times
async function getGameWinCompletionTimes() {
    console.log("Getting player information...");
    sqlQuery = `SELECT u.Username, g.GameID, g.CompletionTime FROM USER u LEFT JOIN GAME g ON u.UserID = g.UserID WHERE g.Ending = 1 ORDER BY CompletionTime ASC`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Game ID</th><th>Completion Time</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].GameID} </td><td> ${toHHMMSS(result.data[i].CompletionTime)} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving Win Completion Time information: " + result.error);
            return "Error retrieving player information.";
        }
}


/// Get Accuse Mini Game Succeeded
async function getMiniGameSucceeded() {
    console.log("Getting player information...");
    sqlQuery = `SELECT u.Username, g.GameID, a.Success FROM USER u LEFT JOIN GAME g ON u.UserID = g.UserID LEFT JOIN ACCUSATION a ON a.GameID = g.GameID WHERE a.Success = true ORDER BY g.GameID ASC`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Game ID</th><th>Success</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].GameID} </td><td> ${result.data[i].Success} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving Games Succeeded information: " + result.error);
            return "Error retrieving player information.";
        }
}
/// Get Total Interactions
async function getTotalInteractions() {
    console.log("Getting player information...");
    sqlQuery = `SELECT u.Username, g.GameID, COUNT(i.GameID) AS TotalInteractions FROM USER u LEFT JOIN GAME g ON u.UserID = g.UserID LEFT JOIN INTERACTION i ON g.GameID = i.GameID GROUP BY i.GameID ORDER BY TotalInteractions DESC;`;
        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();

        if (result.success) {
            var playerInfo = '<table><tr><th class="username-title">Username</th><th>Game ID</th><th>Total Interactions</th></tr>';
            for (var i = 0; i < result.data.length; i++) {
                playerInfo += `<tr><td class="username"> ${result.data[i].Username} </td><td> ${result.data[i].GameID} </td><td> ${result.data[i].TotalInteractions} </td></tr>`;
            }
            playerInfo += "</table>";
            container.innerHTML = playerInfo;
        } else {
            console.log("Error retrieving Total Interactions information: " + result.error);
            return "Error retrieving player information.";
        }
}
