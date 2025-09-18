//This should point to YOUR copy of the dbCnnector.php file.
const dbConnectorUrl = "https://mcrawford37.webhosting1.eeecs.qub.ac.uk/dbConnector.php";
//Update this with YOUR database credentials.
let dbConfig = new URLSearchParams({
hostname: 'localhost',
username: 'mcrawford37',
password: 'pV7YTlmTfLbGD9zm',
database: 'CSC1034_CW_100',
});

// function to hide energy when used
let interactionCount = 0;

function incrementInteractionCount() {
    dropEnergy();
    interactionCount ++;
}

function dropEnergy(){
    let energyCell = document.getElementById('energy-' + interactionCount);
    energyCell.style.visibility = "hidden";
}


//  Page open Functions
function LandingPage() {
    window.location.href = 'landing.html';
    //document.getElementById('playermessage').textContent = 'Logged In as '+ sessionStorage.getItem("username"); 
}
  
function accountCreation() {
    window.location.href = 'createAccount.html';
}
  
//function accountLogin() {
//    window.location.href = 'login.html';
//}

function accountsPage() {
    window.location.href = 'Accounts.html';
}

function openLeaderboards() {
    window.location.href = 'leaderboard.html';
}


function quitGame() {
    // Logic for quitting the game
    window.location.href = 'landing.html'; // Redirect to landing page
}

async function newGame() {
    if(sessionStorage.getItem("loggedIn")=='true'){

        const confirmation = confirm("Are you sure you want to start a new game? If you have a game in progress it will be overwritten. This action cannot be undone.");
        if (confirmation) {
            // overwrite original save by deleting most recent non complete game
            let sqlQuery = `DELETE FROM GAME WHERE (USERID = ${sessionStorage.getItem("userID")}) && (Ending = 0) ORDER BY GameID DESC LIMIT 1;`;
            // GameID, InventoryID, energy and completion time
            console.log(sqlQuery);
            dbConfig.set('query', sqlQuery);
            try {
                let response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
                });
                let result = await response.json();
                if (result.success) {console.log("Previous save overwritten.");}
            }
            catch {console.log("Failed to remove old save.");}
            // Logic for starting a new game
            // CREATE NEW INVENTORY RECORD
            let GameOk  = false;
            sqlQuery = `INSERT INTO INVENTORY (Slot1ItemID,Slot2ItemID) VALUES  (0,0);`;
            dbConfig.set('query', sqlQuery);
            try {
                let response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });
                let result = await response.json();

                if (result.success) {
                    console.log("new Inventory successfully recorded");
                    GameOk =  true;
                } else {
                    console.log("Error recording new Inventory");
                    GameOk = false;
                }
            } catch (error) {
                console.error("Error creating new Inventory record:", error);
                GameOk = false;
            }

            // CREATE A NEW GAME  RECORD LINKED TO THE LATEST INVENTORY RECORD, USING CURRENTLY LOGGED IN USERID
            sqlQuery = `INSERT INTO GAME (UserID, InventoryID, Ending, Energy, CompletionTime) VALUES (${sessionStorage.getItem("userID")}, (SELECT InventoryID FROM INVENTORY ORDER BY InventoryID DESC LIMIT 0,1), 0,9,0);`;
            dbConfig.set('query', sqlQuery);
            try {
                let response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });
                let result = await response.json();

                if (result.success) {
                    console.log("new game successfully recorded");
                    GameOk = true;
                } else {
                    console.log("Error recording new game");
                    GameOk = false;
                }
            } catch (error) {
                console.error("Error creating new game record:", error);
                GameOk = false;
            }
            // CLEAR THE GAME STATE AND LAUNCH GAME
            if(GameOk){
                // add  new game ID to the session
                sqlQuery = `SELECT GameID FROM GAME ORDER BY GameID DESC LIMIT 0,1;`;
                dbConfig.set('query', sqlQuery);
                try {
                    let response = await fetch(dbConnectorUrl, {
                        method: "POST",
                        body: dbConfig
                    });
                    let result = await response.json();
        
                    if (result.success) {
                        let results = result.data[0];
                        sessionStorage.setItem("gameID", results.GameID);
                        sessionStorage.setItem("completionTime",0);
                        sessionStorage.setItem("energy",9);
                        sessionStorage.setItem("ending", 0);
                        let interactionsArr = [];
                        // interaction items will be arranged as [<GameID>,<Character number>,<InteractionType>]
                        let accusationsArr = [];
                        // interaction items will be arranged as [<GameID>,<Character number>,<Success?>]
                        sessionStorage.setItem("interactionsArr",JSON.stringify(interactionsArr));
                        sessionStorage.setItem("accusationsArr",JSON.stringify(accusationsArr));
                        //sessionStorage.setItem("inventory", [1,2]);
                        sqlQuery = `SELECT * FROM ITEM WHERE ItemID = 0;`;
                        dbConfig.set('query', sqlQuery);
                        try {
                            let response = await fetch(dbConnectorUrl, {
                                method: "POST",
                                body: dbConfig
                            });
                            let result = await response.json();

                            if (result.success) {
                                console.log("blank Item retrieved");
                                sessionStorage.setItem("inventory", JSON.stringify([result.data[0],result.data[0]]));
                                console.log("game successfully loaded: " + sessionStorage.getItem("gameID"));
                                localStorage.removeItem('gameState'); // Clear saved game state 
            
                                // GENERATE THIS GAME'S 2 RANDOM ITEMS and loads their information from the database
                                let gameItems = generateItems();
                                let tempInventory = [];
                                console.log(gameItems[0]);
                                sqlQuery = `SELECT * FROM ITEM WHERE ItemID =  ${gameItems[0]};`;
                                dbConfig.set('query', sqlQuery);
                                try {
                                    let response = await fetch(dbConnectorUrl, {
                                        method: "POST",
                                        body: dbConfig
                                    });
                                    let result = await response.json();
            
                                    if (result.success) {
                                        console.log("Item 1 retrieved");
                                        tempInventory[0] = result.data[0];
                                        sqlQuery = `SELECT * FROM ITEM WHERE ItemID =  ${gameItems[1]};`;
                                        dbConfig.set('query', sqlQuery);
                                        try {
                                            let response = await fetch(dbConnectorUrl, {
                                                method: "POST",
                                                body: dbConfig
                                            });
                                            let result = await response.json();
            
                                            if (result.success) {
                                                console.log("Item 2 retrieved");
                                                tempInventory[1] = result.data[0];
                                                sessionStorage.setItem("diningItem", JSON.stringify(tempInventory[0]));
                                                sessionStorage.setItem("hallItem", JSON.stringify(tempInventory[1]));
                                                sessionStorage.setItem("newGame", true);
                                                window.location.href = 'game.html'; // Redirect to game page
                                            } else {
                                                console.log("Error getting item 2");
                                            }
                                        } catch (error) {
                                            console.error("Error getting item from item table:", error);
                                        }
                                    } else {
                                        console.log("Error getting item 1");
                                    }
                                } catch (error) {
                                    console.error("Error getting item from item table:", error);
                                }
                            } else {
                                console.log("Error getting blank item");
                            }
                        } catch (error) {
                            console.error("Error getting blank item from item table:", error);
                        }

                    } else {
                        console.log("Error retrieving  gameID");
                        alert("Error retrieving  gameID");
                    }
                } catch (error) {
                    console.error("Error retrieving  gameID:", error);
                }
            }
            else{
                alert("Failed to create a save file.");
            }
        }
        
    } else { alert("You are not logged in.")}
}

function loadSave() {
    if(sessionStorage.getItem("loggedIn")){
        sessionStorage.setItem("newGame", false);
        loadGame();
    } else { alert("You are not logged in.")}
}

function playBackground() {
    const backgroundAudio = document.getElementById('background_music');
    backgroundAudio.play();
}

function generateItems() {
    let numbers = [];
    // Generate two unique random numbers
    while (numbers.length < 2) {
      let num = Math.floor(Math.random() * 6) + 1;  // Random number between 1 and 6
        if (!numbers.includes(num)) {
        numbers.push(num);
        }
    }
    return numbers;
}

// Function to navigate to the delete account page
function deleteAccountPage() {
    window.location.href = "deleteAccount.html";
}


// Function to navigate to the update account page
function updateAccountPage() {
    window.location.href = "updateAccount.html";
}

// Function to check if the user is logged in for viewing user stats 
function checkLoginStatus() {
    if (!sessionStorage.getItem("loggedIn") || sessionStorage.getItem("loggedIn") !== 'true') {
        // Show an alert informing the user they need to be logged in
        alert("You need to be logged in to access player statistics. Please log in first.");
        // Redirect to login page
        window.location.href = 'Accounts.html';
        return false;
    }
    return true;
}

// Function to navigate to player stats page
function statsPage() {
    if (checkLoginStatus()) {
        window.location.href = 'playerstats.html';
    }
}
function biggerTextCheck(){
    if (document.getElementById("biggerText").checked){
        sessionStorage.setItem("biggerText", true);
    }
    else{
        sessionStorage.setItem("biggerText", false);
    }
    toggleText();
}

function toggleText(){
    let ok = sessionStorage.getItem("biggerText");
    if(ok == 'true'){
        console.log("Bigger text 1.6em");
        adjustCSSRules('p', 'font-size: 1.6em');
        adjustCSSRules('button', 'font-size: 1.6em');
        adjustCSSRules('form', 'font-size: 1.6em');
        adjustCSSRules('.text-box', 'line-height: 1.9em');
    }
    else{
        console.log("smaller text");
        adjustCSSRules('p', 'font-size: 1.2em');
        adjustCSSRules('button', 'font-size: 1em');
        adjustCSSRules('form', 'font-size: 1em');
        adjustCSSRules('.text-box', 'line-height: 1.7em');
    }
}

function adjustCSSRules(selector, props, sheets){
    // get stylesheet(s)
    if (!sheets) sheets = [...document.styleSheets];
    else if (sheets.sup)
    {    // sheets is a string
        let absoluteURL = new URL(sheets, document.baseURI).href;
        sheets = [...document.styleSheets].filter(i => i.href == absoluteURL);
    }
    else sheets = [sheets];  // sheets is a stylesheet
    // CSS (& HTML) reduce spaces in selector to one.
    selector = selector.replace(/\s+/g, ' ');
    const findRule = s => [...s.cssRules].reverse().find(i => i.selectorText == selector)
    let rule = sheets.map(findRule).filter(i=>i).pop()
    const propsArr = props.sup
        ? props.split(/\s*;\s*/).map(i => i.split(/\s*:\s*/)) // from string
        : Object.entries(props);                              // from Object
    if (rule) for (let [prop, val] of propsArr){
        // rule.style[prop] = val; is against the spec, and does not support !important.
        rule.style.setProperty(prop, ...val.split(/ *!(?=important)/));
        }
    else {
        sheet = sheets.pop();
        if (!props.sup) props = propsArr.reduce((str, [k, v]) => `${str}; ${k}: ${v}`, '');
        sheet.insertRule(`${selector} { ${props} }`, sheet.cssRules.length);
        }
    }
    
