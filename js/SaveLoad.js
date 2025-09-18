// GAME DATA


// Save Game Function
async function saveGame(end) {
    saveTime();
    // update game table with new energy and completion time.  If saving,  other table values should not change because save is not game end.
    let sqlQuery = `UPDATE GAME SET
                    Ending = ${sessionStorage.getItem("ending")},
                    Energy = ${sessionStorage.getItem("energy")},
                    CompletionTime = ${sessionStorage.getItem("completionTime")}
    WHERE GameID = ${sessionStorage.getItem("gameID")}`;

    console.log(sqlQuery);
    dbConfig.set('query', sqlQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
        method: "POST",
        body: dbConfig
        });
        let result = await response.json();
        if (result.success) {
            console.log("Game Table Updated successfully!");
            let tempInventory =  JSON.parse(sessionStorage.getItem("inventory"));
            let item1ID = tempInventory[0].ItemID;
            let item2ID = tempInventory[1].ItemID;
            // update Inventory table
            sqlQuery = `UPDATE INVENTORY SET
                            Slot1ItemID = ${item1ID},
                            Slot2ItemID = ${item2ID}
            WHERE InventoryID = (
                                SELECT InventoryID
                                FROM GAME
                                WHERE gameID = ${sessionStorage.getItem("gameID")}
            );`;
            console.log(sqlQuery);
            dbConfig.set('query', sqlQuery);
            try {
                let response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
                });
                let result = await response.json();
                if (result.success) {
                    console.log("Inventory Table Updated successfully!");
                    // add all session storage interactions from an array to the interactions table
                    let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                    // loop through array of interractions
                    if(interactionsArr.length>0){
                        for(let i = 0;i<interactionsArr.length;i++){
                            switch(interactionsArr[i]){
                                case "1_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 1,1);`;
                                    break;
                                case "1_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 1,2);`;
                                    break;
                                case "1_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 1,3);`;
                                    break;
                                case "2_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 2,1);`;
                                    break;
                                case "2_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 2,2);`;
                                    break;
                                case "2_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 2,3);`;
                                    break;
                                case "3_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 3,1);`;
                                    break;
                                case "3_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 3,2);`;
                                    break;
                                case "3_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 3,3);`;
                                    break;
                                case "4_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 4,1);`;
                                    break;
                                case "4_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 4,2);`;
                                    break;
                                case "4_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 4,3);`;
                                    break;
                                case "5_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 5,1);`;
                                    break;
                                case "5_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 5,2);`;
                                    break;
                                case "5_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 5,3);`;
                                    break;
                                case "6_1":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 6,1);`;
                                    break;
                                case "6_2":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 6,2);`;
                                    break;
                                case "6_3":
                                    sqlQuery = `INSERT INTO INTERACTION (GameID, CharacterNumber, InteractionType) VALUES (${sessionStorage.getItem("gameID")}, 6,3);`;
                                    break;
                            }
                            // make records for each
                            console.log(sqlQuery);
                            dbConfig.set('query', sqlQuery);
                            try {
                                let response = await fetch(dbConnectorUrl, {
                                method: "POST",
                                body: dbConfig
                                });
                                let result = await response.json();
                                if (result.success) {
                                    console.log("Interaction logged");
                                }
                            }
                            catch{console.error("Error saving interaction:", error);}
                        }
                    }
                    else{
                        console.log("no interractions");
                    }
                    // add all session storage interactions from an array to the interactions table
                    let accusationsArr = JSON.parse(sessionStorage.getItem("accusationsArr"));
                    // loop through array of interractions
                    if(accusationsArr.length>0){
                        for(let i = 0;i<accusationsArr.length;i++){
                            switch(accusationsArr[i]){
                                case "1_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 1,0);`;
                                    break;
                                case "1_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 1,1);`;
                                    break;
                                case "2_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 2,0);`;
                                    break;
                                case "2_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 2,1);`;
                                    break;
                                case "3_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 3,0);`;
                                    break;
                                case "3_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 3,1);`;
                                    break;
                                case "4_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 4,0);`;
                                    break;
                                case "4_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 4,1);`;
                                    break;
                                case "5_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 5,0);`;
                                    break;
                                case "5_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 5,1);`;
                                    break;
                                case "6_0":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 6,0);`;
                                    break;
                                case "6_1":
                                    sqlQuery = `INSERT INTO ACCUSATION (GameID, CharacterNumber, Success) VALUES (${sessionStorage.getItem("gameID")}, 6,1);`;
                                    break;
                            }
                            // make records for each
                            console.log(sqlQuery);
                            dbConfig.set('query', sqlQuery);
                            try {
                                let response = await fetch(dbConnectorUrl, {
                                method: "POST",
                                body: dbConfig
                                });
                                let result = await response.json();
                                if (result.success) {
                                    console.log("Accusation logged");
                                }
                            }
                            catch{console.error("Error saving Accusation:", error);}
                        }
                    }
                    else{
                        console.log("no accusations");
                    }
                    if(end){
                        // increment game count
                        sqlQuery = `UPDATE USER SET TotalGames = (TotalGames + 1) WHERE UserID = ${sessionStorage.getItem("userID")}`;
                        console.log(sqlQuery);
                        dbConfig.set('query', sqlQuery);
                        try {
                            let response = await fetch(dbConnectorUrl, {
                            method: "POST",
                            body: dbConfig
                            });
                            let result = await response.json();
                            if (result.success) {
                                console.log("TotalGames incremented");
                            }
                        }
                        catch{console.error("Error incrementing total games:", error);}
                    }
                }
            } catch {
                console.error("Error saving game:", error);
            }
        }
        else {
            console.error("Error saving game.", result);
        }
    } catch {
        console.error("Error saving game:", error);
    }
    console.log("Game Saved");
}

async function loadGame() {
    // find most recent, ending=0 record for userID in game table and pull 
    sqlQuery = `SELECT GameID, InventoryID, Energy, CompletionTime FROM GAME WHERE (USERID = ${sessionStorage.getItem("userID")}) && (Ending = 0) ORDER BY GameID DESC LIMIT 0,1;`;
    // GameID, InventoryID, energy and completion time
    console.log(sqlQuery);
    dbConfig.set('query', sqlQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
        method: "POST",
        body: dbConfig
        });
        let result = await response.json();
        if (result.success) {
            if(result.data.length == 0){
                alert("No save data found, start a new game.");
            }
            else{
                console.log("Retrieved Save Data");
                // set session data for these attributes of the game
                sessionStorage.setItem("gameID", result.data[0].GameID);
                console.log(sessionStorage.getItem("gameID"));
                sessionStorage.setItem("inventoryID", result.data[0].InventoryID);
                console.log(sessionStorage.getItem("inventoryID"));
                sessionStorage.setItem("energy", result.data[0].Energy);
                console.log(sessionStorage.getItem("energy"));
                sessionStorage.setItem("completionTime", result.data[0].CompletionTime);
                console.log(sessionStorage.getItem("completionTime"));
                sessionStorage.setItem("ending", 0);
                console.log(sessionStorage.getItem("ending"));
                // retrieve Inventory items for the Inventory ID and store in session storage
                sqlQuery = `SELECT Slot1ItemID, Slot2ItemID FROM INVENTORY WHERE (InventoryID = ${sessionStorage.getItem("inventoryID")});`;
                // GameID, InventoryID, energy and completion time
                console.log(sqlQuery);
                dbConfig.set('query', sqlQuery);
                try {
                    let response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                    });
                    let result = await response.json();
                    if (result.success) {
                        if(result.data.length == 0){
                            console.log("No Inventory data found. Load failed.");
                        }
                        else{
                            let tempArr = [];
                            tempArr[0] = result.data[0].Slot1ItemID;
                            tempArr[1] = result.data[0].Slot2ItemID;
                            console.log("Retrieved Inventory Save Data");
                            // retrieve items from item table
                            let tempInventory = [];
                            sqlQuery = `SELECT * FROM ITEM WHERE ItemID =  ${tempArr[0]};`;
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
                                    sqlQuery = `SELECT * FROM ITEM WHERE ItemID =  ${tempArr[1]};`;
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
                                            sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                                            console.log(sessionStorage.getItem("inventory"));
                                            let accusationsArr = [];
                                            let interactionsArr = [];;
                                            sessionStorage.setItem("interactionsArr",JSON.stringify(interactionsArr));
                                            sessionStorage.setItem("accusationsArr",JSON.stringify(accusationsArr));
                                            window.location.href = 'game.html';
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
                        }
                    }
                } catch {
                    console.error("Error loading saved Inventory:", error);
                }
            }
        }
    } catch {
        console.error("Error loading saved game:", error);
    }

    // note we do not need to load accusations or interactions
}
