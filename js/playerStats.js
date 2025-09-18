let container = document.getElementById("resultsContainer");

// Best Win Time
async function getBestWinTime() {
    console.log("Getting best win time...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID, g.CompletionTime 
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            WHERE u.Username = '${username}' 
            AND g.Ending = 1 
            AND g.CompletionTime IS NOT NULL
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Win Time</th></tr>';
            
            if (result.data && result.data.length > 0) {
                // Show all winning games
                let bestTime = Infinity;
                for (var i = 0; i < result.data.length; i++) {
                    // Convert CompletionTime to number
                    const gameTime = parseInt(result.data[i].CompletionTime) || 0;
                    if (gameTime > 0 && gameTime < bestTime) {
                        bestTime = gameTime;
                    }
                    statsHtml += `<tr>
                        <td class="username">Game ${result.data[i].GameID}</td>
                        <td>${toHHMMSS(gameTime)}</td>
                    </tr>`;
                }
                
                // Add a divider row
                statsHtml += `<tr><td colspan="2"><hr></td></tr>`;
                
                // Add best time row
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Best Win Time</td>
                    <td>${bestTime === Infinity ? 'No valid times' : toHHMMSS(bestTime)}</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="2">No winning games found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving best win time: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="2">Error retrieving best win time</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getBestWinTime:", error);
        container.innerHTML = '<table><tr><th colspan="2">Error retrieving best win time</th></tr></table>';
    }
}

// Total Play Time
async function getTotalPlayTime() {
    console.log("Getting total play time...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID, g.CompletionTime 
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            WHERE u.Username = '${username}' 
            AND g.CompletionTime IS NOT NULL
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Completion Time</th></tr>';
            
            if (result.data && result.data.length > 0) {
                // Show all games
                let totalTime = 0;
                for (var i = 0; i < result.data.length; i++) {
                    // Convert CompletionTime to number
                    const gameTime = parseInt(result.data[i].CompletionTime) || 0;
                    totalTime += gameTime; // Add to running total
                    statsHtml += `<tr>
                        <td class="username">Game ${result.data[i].GameID}</td>
                        <td>${toHHMMSS(gameTime)}</td>
                    </tr>`;
                }
                
                // Add a divider row
                statsHtml += `<tr><td colspan="2"><hr></td></tr>`;
                
                // Add total row
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Total Time</td>
                    <td>${toHHMMSS(totalTime)}</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="2">No games found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving total play time: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="2">Error retrieving total play time</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getTotalPlayTime:", error);
        container.innerHTML = '<table><tr><th colspan="2">Error retrieving total play time</th></tr></table>';
    }
}

// Get Total Games Statistics
async function getTotalGames() {
    console.log("Getting total games statistics...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            WHERE u.Username = '${username}' 
            AND g.GameID IS NOT NULL
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th></tr>';
            
            if (result.data && result.data.length > 0) {
                let totalGames = 0;

                // Show all games
                for (var i = 0; i < result.data.length; i++) {
                    totalGames++;
                    statsHtml += `<tr>
                        <td class="username">Game ${result.data[i].GameID}</td>
                    </tr>`;
                }
                
                // Add a divider row
                statsHtml += `<tr><td><hr></td></tr>`;
                
                // Add total games
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Total Games: ${totalGames}</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td>No games found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving total games: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th>Error retrieving total games</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getTotalGames:", error);
        container.innerHTML = '<table><tr><th>Error retrieving total games</th></tr></table>';
    }
}


// Get Endings Statistics
async function getEndings() {
    console.log("Getting endings statistics...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID, g.Ending 
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            WHERE u.Username = '${username}' 
            AND g.Ending IS NOT NULL
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Ending</th></tr>';
            
            if (result.data && result.data.length > 0) {
                // Initialize counters
                let ending1Count = 0;
                let ending2Count = 0;
                let ending3Count = 0;

                // Show all games
                for (var i = 0; i < result.data.length; i++) {
                    const endingType = result.data[i].Ending;
                    
                    // Count endings
                    switch(parseInt(endingType)) {
                        case 1: ending1Count++; break;
                        case 2: ending2Count++; break;
                        case 3: ending3Count++; break;
                    }

                    statsHtml += `<tr>
                        <td class="username">Game ${result.data[i].GameID}</td>
                        <td>Ending ${endingType}</td>
                    </tr>`;
                }
                
                // Add a divider row
                statsHtml += `<tr><td colspan="2"><hr></td></tr>`;
                
                // Add summary rows
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Ending 1</td>
                    <td>${ending1Count}</td>
                </tr>`;
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Ending 2</td>
                    <td>${ending2Count}</td>
                </tr>`;
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Ending 3</td>
                    <td>${ending3Count}</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="2">No games found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving endings: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="2">Error retrieving endings</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getEndings:", error);
        container.innerHTML = '<table><tr><th colspan="2">Error retrieving endings</th></tr></table>';
    }
}
// Get Interaction Statistics
async function getInteractionStats() {
    console.log("Getting interaction statistics...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID, 
            i.InteractionID, i.InteractionType, i.CharacterNumber as IntCharacter,
            a.AccusationID, a.CharacterNumber as AccCharacter
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            LEFT JOIN INTERACTION i ON g.GameID = i.GameID
            LEFT JOIN ACCUSATION a ON g.GameID = a.GameID
            WHERE u.Username = '${username}' 
            AND (i.InteractionID IS NOT NULL OR a.AccusationID IS NOT NULL)
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Action Type</th><th>Character</th></tr>';
            
            if (result.data && result.data.length > 0) {
                let interactionCount = 0;
                let accusationCount = 0;

                // Show all interactions and accusations
                for (var i = 0; i < result.data.length; i++) {
                    const row = result.data[i];
                    
                    // Handle Interactions
                    if (row.InteractionID) {
                        interactionCount++;
                        statsHtml += `<tr>
                            <td class="username">Game ${row.GameID}</td>
                            <td>Interaction ${row.InteractionType}</td>
                            <td>Character ${row.IntCharacter}</td>
                        </tr>`;
                    }
                    
                    // Handle Accusations
                    if (row.AccusationID) {
                        accusationCount++;
                        statsHtml += `<tr>
                            <td class="username">Game ${row.GameID}</td>
                            <td>Accusation</td>
                            <td>Character ${row.AccCharacter}</td>
                        </tr>`;
                    }
                }
                
                // Add a divider row
                statsHtml += `<tr><td colspan="3"><hr></td></tr>`;
                
                // Add summary rows
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Total Interactions</td>
                    <td colspan="2">${interactionCount}</td>
                </tr>`;
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Total Accusations</td>
                    <td colspan="2">${accusationCount}</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="3">No interactions or accusations found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving interactions: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="3">Error retrieving interactions</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getInteractionStats:", error);
        container.innerHTML = '<table><tr><th colspan="3">Error retrieving interactions</th></tr></table>';
    }
}

// Get Favorite Character Statistics
async function getFavoriteStats() {
    console.log("Getting favorite character statistics...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID,
            i.CharacterNumber as IntCharacter,
            a.CharacterNumber as AccCharacter
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            LEFT JOIN INTERACTION i ON g.GameID = i.GameID
            LEFT JOIN ACCUSATION a ON g.GameID = a.GameID
            WHERE u.Username = '${username}' 
            AND (i.CharacterNumber IS NOT NULL OR a.CharacterNumber IS NOT NULL)
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Character</th><th>Action Type</th></tr>';
            
            if (result.data && result.data.length > 0) {
                // Initialize character counters
                let characterCounts = {
                    1: { count: 0, name: "Ed (Edmund) Hereward" },
                    2: { count: 0, name: "Adam Turner" },
                    3: { count: 0, name: "Cian O'Shea" },
                    4: { count: 0, name: "Thomas Hawke" },
                    5: { count: 0, name: "Albert Sykes" },
                    6: { count: 0, name: "Vivienne Bennett" }
                };

                // Show all character interactions
                for (var i = 0; i < result.data.length; i++) {
                    const row = result.data[i];
                    
                    // Count Interactions
                    if (row.IntCharacter) {
                        characterCounts[row.IntCharacter].count++;
                        statsHtml += `<tr>
                            <td class="username">Game ${row.GameID}</td>
                            <td>Character ${row.IntCharacter}</td>
                            <td>Interaction</td>
                        </tr>`;
                    }
                    
                    // Count Accusations
                    if (row.AccCharacter) {
                        characterCounts[row.AccCharacter].count++;
                        statsHtml += `<tr>
                            <td class="username">Game ${row.GameID}</td>
                            <td>Character ${row.AccCharacter}</td>
                            <td>Accusation</td>
                        </tr>`;
                    }
                }
                
                // Find favorite character
                let favoriteChar = Object.entries(characterCounts)
                    .reduce((max, [charNum, data]) => 
                        data.count > max.count ? {num: charNum, ...data} : max, 
                        {num: 0, count: -1, name: ""});

                // Add a divider row
                statsHtml += `<tr><td colspan="3"><hr></td></tr>`;
                
                // Add counts for each character
                for (let charNum in characterCounts) {
                    statsHtml += `<tr>
                        <td class="username">Character ${charNum}</td>
                        <td colspan="2">${characterCounts[charNum].count} interactions</td>
                    </tr>`;
                }
                
                // Add favorite character summary
                statsHtml += `<tr><td colspan="3"><hr></td></tr>`;
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Favorite Character:</td>
                    <td colspan="2">Character ${favoriteChar.num} - ${favoriteChar.name} (${favoriteChar.count} interactions)</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="3">No character interactions found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving favorite stats: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="3">Error retrieving favorite stats</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getFavoriteStats:", error);
        container.innerHTML = '<table><tr><th colspan="3">Error retrieving favorite stats</th></tr></table>';
    }
}

// Get Favorite Interaction Type Statistics
async function getFavoriteInteractionType() {
    console.log("Getting favorite interaction type statistics...");
    try {
        const username = sessionStorage.getItem("username");
        console.log("Username:", username);

        sqlQuery = `SELECT u.Username, g.GameID, i.InteractionType
            FROM USER u 
            LEFT JOIN GAME g ON u.UserID = g.UserID 
            LEFT JOIN INTERACTION i ON g.GameID = i.GameID
            WHERE u.Username = '${username}' 
            AND i.InteractionType IS NOT NULL
            ORDER BY g.GameID DESC`;

        dbConfig.set('query', sqlQuery);
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        result = await response.json();
        console.log("Query result:", result);

        if (result && result.success) {
            var statsHtml = '<table>';
            statsHtml += '<tr><th class="username-title">Game ID</th><th>Interaction Type</th></tr>';
            
            if (result.data && result.data.length > 0) {
                // Initialize interaction type counters
                let interactionCounts = {
                    1: { count: 0, name: "Discuss" },
                    2: { count: 0, name: "Confront" },
                    3: { count: 0, name: "Gift" }
                };

                // Show all interactions
                for (var i = 0; i < result.data.length; i++) {
                    const row = result.data[i];
                    const intType = row.InteractionType;
                    
                    if (intType && interactionCounts[intType]) {
                        interactionCounts[intType].count++;
                        statsHtml += `<tr>
                            <td class="username">Game ${row.GameID}</td>
                            <td>Type ${intType} (${interactionCounts[intType].name})</td>
                        </tr>`;
                    }
                }
                
                // Find favorite interaction type
                let favoriteType = Object.entries(interactionCounts)
                    .reduce((max, [typeNum, data]) => 
                        data.count > max.count ? {num: typeNum, ...data} : max, 
                        {num: 0, count: -1, name: ""});

                // Add a divider row
                statsHtml += `<tr><td colspan="2"><hr></td></tr>`;
                
                // Add counts for each interaction type
                for (let typeNum in interactionCounts) {
                    statsHtml += `<tr>
                        <td class="username">Type ${typeNum} (${interactionCounts[typeNum].name})</td>
                        <td>${interactionCounts[typeNum].count} uses</td>
                    </tr>`;
                }
                
                // Add favorite interaction type summary 
                statsHtml += `<tr><td colspan="2"><hr></td></tr>`;
                statsHtml += `<tr style="font-weight: bold;">
                    <td class="username">Favorite Interaction Type:</td>
                    <td>Type ${favoriteType.num} (${favoriteType.name}) - ${favoriteType.count} uses</td>
                </tr>`;
            } else {
                statsHtml += '<tr><td colspan="2">No interactions found</td></tr>';
            }
            statsHtml += "</table>";
            container.innerHTML = statsHtml;
        } else {
            console.log("Error retrieving interaction types: ", result ? result.error : "No result");
            container.innerHTML = '<table><tr><th colspan="2">Error retrieving interaction types</th></tr></table>';
        }
    } catch (error) {
        console.error("Error in getFavoriteInteractionType:", error);
        container.innerHTML = '<table><tr><th colspan="2">Error retrieving interaction types</th></tr></table>';
    }
}


// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (!checkLoginStatus()) {
            container.innerHTML = '<table><tr><th colspan="2">Please log in to view statistics</th></tr></table>';
            return;
        }
        const username = sessionStorage.getItem("username");
        if (!username) {
            container.innerHTML = '<table><tr><th colspan="2">Username not found in session</th></tr></table>';
            return;
        }
        console.log("Initializing with username:", username);
        getBestWinTime(); // Start with best win time 
    } catch (error) {
        console.error("Error during initialization:", error);
        container.innerHTML = '<table><tr><th colspan="2">Error initializing statistics</th></tr></table>';
    }
});

function goToMainMenu() {
    window.location.href = "landing.html";
}