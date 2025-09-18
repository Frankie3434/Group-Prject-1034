// getting error where gmae state not initialized, declaring here fixes it.
let gameState = {};
let scenes = {};
let emptyItem;


async function getEmptySlot(){
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
            emptyItem = result.data[0];
        }
    }
    catch {console.log("error retrieving blank item");}
}

// Load scenes from JSON file
async function loadScenes() {
    try {
        const response = await fetch(".vscode/scenes copy.json");
        scenes = await response.json();
        getEmptySlot();
        if(sessionStorage.getItem("playingSnake")  == "true"){
            sessionStorage.setItem("saveOK", false);
            sessionStorage.setItem("playingSnake",false);
            if(sessionStorage.getItem("snakeWon") == "true"){
                startGame("inspect_hallway_object");
            }
            else  
            {
                startGame("inspect_hallway_fail");
            }
        }
        else if(sessionStorage.getItem("playingBlackjack")  == "true"){
            sessionStorage.setItem("saveOK", false);
            sessionStorage.setItem("playingBlackjack",false);
            if(sessionStorage.getItem("BlackjackWon") == "true"){
                startGame("inspect_dining_object");
            }
            else  
            {
                startGame("inspect_dining_object_fail");
            }
        }

        else if(sessionStorage.getItem("playingRockPaperScissors") == "true"){
            sessionStorage.setItem("saveOK", false);
            sessionStorage.setItem("playingRockPaperScissors", false);
            if(sessionStorage.getItem("rockPaperScissorsWon") == "true") {
                startGame("fireplace_object_success");
            }

            else {
                startGame("fireplace_object_fail");
            }
        }
        else if(sessionStorage.getItem("newGame") == "true")
        {
            sessionStorage.setItem("saveOK", false);
            sessionStorage.setItem("newGame", false);
            startGame("intro");
        }
        else{
            let tempaccused = parseInt(sessionStorage.getItem("accusedCharacter"));
            if(tempaccused != 1 && tempaccused != 2 && tempaccused != 3 && tempaccused != 4  && tempaccused != 5 && tempaccused != 6 )
            {
                startGame("investigation_main");
            }
            else if (tempaccused == 1){
                startGame("Character1Accusation");
            }
            else if (tempaccused == 2){
                startGame("Character2WrongAccusation");
            }
            else if (tempaccused == 3){
                startGame("Character3WrongAccusation");
            }
            else if (tempaccused == 4){
                startGame("Character4WrongAccusation");
            }
            else if (tempaccused == 5){
                startGame("Character5WrongAccusation");
            }
            else if (tempaccused == 6){
                startGame("Character6WrongAccusation");
            } 
        }
        startGame();
    } catch (error) {
        console.error("Error loading scenes:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadScenes);

function startGame(scene) {
    // Initialize with intro scene
    gameState = {
        currentScene: scene,
        inventory: JSON.parse(sessionStorage.getItem("inventory")),
        energy: sessionStorage.getItem("energy"),
    };
    updateGameDisplay();
}

function transitionToScene(sceneName) {
    if (scenes[sceneName]) {
        const scene = scenes[sceneName];
        const energyCost = scene.energyCost || 0;

        // Check if player has enough energy
        if (gameState.energy - energyCost < 0) {
            timeOutEndBackup();
            return;
        }

        gameState.currentScene = sceneName;
        gameState.energy = Math.max(0, gameState.energy - energyCost);
        gameState.inventory = JSON.parse(sessionStorage.getItem("inventory"));
        sessionStorage.setItem("energy", gameState.energy);
        updateGameDisplay();
    }
}

// Update game display with new state data
function updateGameDisplay() {
    const gameText = document.getElementById("game-text");
    const options = document.getElementById("options");
    const inventoryList = document.getElementById("inventory-list");
    const gameImage = document.getElementById("game-image");
    const imageDescription = document.getElementById("image-description");

    // Update energy display
    for (let i = 0; i <= 8; i++) {
        const energyPoint = document.getElementById(`energy-${i}`);
        if (energyPoint) {
            energyPoint.style.opacity = i < gameState.energy ? "1" : "0.2";
        }
    }
    let tempEnergy = parseInt(sessionStorage.getItem('energy'));
    let temptest = sessionStorage.getItem("accusedCharacter");
    if (tempEnergy == 0 && (temptest == "0" || temptest == null)) {
        timeOutEnd();
    }
    else if(tempEnergy>=0)
    {
        const currentScene = scenes[gameState.currentScene];
        const sceneName = gameState.currentScene;
        if (!currentScene) {
            console.error("Scene not found:", gameState.currentScene);
            return;
        }

        if(sceneName == "intro"){
            gameText.textContent = `The room is thick with tension, the air heavy with the metallic scent of blood.\r\n A body lies sprawled across the ornate rug, lifeless eyes staring into nothing.\r\nA sharp gasp breaks the silence—Vivienne, the wealthy widow, clutches her pearl necklace, her face drained of color.\r\nBeside her, Edmund, the sharp-eyed gambler, adjusts his tie with unsettling calm.\r\nAcross the room, Adam, the friendly tutor, lets out a stifled sob.\r\nThe ever-composed butler Thomas kneels beside the corpse of the house's Master, already assessing the scene with clinical detachment.\r\nIn the corner, Cian, the usually upbeat chef, grips his glass so tightly it might shatter.\r\nWhile the burly chauffeur, Albert, simply crosses his arms, his jaw clenched.\r\nAnd then there's you, ${sessionStorage.getItem("username")}.\r\nSeven people.\r\nOne dead body.\r\nOne killer in the room.\r\nHow long will the backup generator last?\r\n`;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => transitionToScene(option.nextScene);
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }
        else if(sceneName == "footprint_clue"){
            gameText.textContent = currentScene.text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => runSnake();
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }
        else if(sceneName == "examine_dining_room"){
            gameText.textContent = currentScene.text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => runBlackjack();
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }

        else if(sceneName == "fireplace") {
            gameText.textContent = currentScene.text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => runRockPaperScissors();
                options.appendChild(button);
            });

            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }
        else if(sceneName == "inspect_dining_object"){
            let item = JSON.parse(sessionStorage.getItem("diningItem"));
    
            let text = "You pick up the object.\r\n" + item.ItemDesc;
    
            gameText.textContent = text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => transitionToScene(option.nextScene);
                options.appendChild(button);
            });
    
            gameImage.src = item.ImagePath;
            imageDescription.textContent = item.ItemName;
    
            let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
            if(tempInventory[0].ItemName != "Empty Slot"){
                tempInventory[1] = item;
            }
            else{
                tempInventory[0] = item;
            }
            sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
        }
        else if(sceneName == "inspect_hallway_object"){
            let item = JSON.parse(sessionStorage.getItem("hallItem"));
    
            let text = "You pick up the object.\r\n" + item.ItemDesc;
    
            gameText.textContent = text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => transitionToScene(option.nextScene);
                options.appendChild(button);
            });
    
            gameImage.src = item.ImagePath;
            imageDescription.textContent = item.ItemName;
    
            let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
            if(tempInventory[0].ItemName != "Empty Slot"){
                tempInventory[1] = item;
            }
            else{
                tempInventory[0] = item;
            }
            sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
        }
        else if(sceneName == "Accuse"){
            let text = "Well " + sessionStorage.getItem("username") + "?\r\nWho do you think did it?\r\nWho is the culprit?";
            gameText.textContent = text;
            options.innerHTML = "";
            // Character 1
            const img1 = document.createElement("img");
            img1.src = "img\\character1.jpg";
            img1.alt = "Edmund Hereward";
            img1.style.cursor = "pointer";
            img1.style.width = "250px";
            img1.onclick = () => {sessionStorage.setItem("accusedCharacter", 1); runAccuseMinigame(1);};
            options.appendChild(img1);
    
            // Character 1
            let img2 = document.createElement("img");
            img2.src = "img\\character2.jpg";
            img2.alt = "Adam Turner";
            img2.style.cursor = "pointer";
            img2.style.width = "250px";
            img2.onclick = () => {sessionStorage.setItem("accusedCharacter", 2); runAccuseMinigame(2);};
            options.appendChild(img2);
    
            // Character 3
            let img3 = document.createElement("img");
            img3.src = "img\\character3.jpg";
            img3.alt = "Cian O’Shea";
            img3.style.cursor = "pointer";
            img3.style.width = "250px";
            img3.onclick = () => {sessionStorage.setItem("accusedCharacter", 3); runAccuseMinigame(2);};
            options.appendChild(img3);
    
            // Character 4
            let img4 = document.createElement("img");
            img4.src = "img\\character4.jpg";
            img4.alt = "Thomas Hawke";
            img4.style.cursor = "pointer";
            img4.style.width = "250px";
            img4.onclick = () => {sessionStorage.setItem("accusedCharacter", 4); runAccuseMinigame(2);};
            options.appendChild(img4);
    
    
            // Character 5
            let img5 = document.createElement("img");
            img5.src = "img\\character5.jpg";
            img5.alt = "Albert Sykes";
            img5.style.cursor = "pointer";
            img5.style.width = "250px";
            img5.onclick = () => {sessionStorage.setItem("accusedCharacter", 5); runAccuseMinigame(2);};
            options.appendChild(img5);
    
            
            // Character 6
            let img6 = document.createElement("img");
            img6.src = "img\\character6.jpg";
            img6.alt = "Vivienne Bennett";
            img6.style.cursor = "pointer";
            img6.style.width = "250px";
            img6.onclick = () => {sessionStorage.setItem("accusedCharacter", 6); runAccuseMinigame(2);};
            options.appendChild(img6);
    
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => transitionToScene(option.nextScene);
                button.style.display = "block";
                button.style.margin = "0 auto";
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
    
            let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
            if(tempInventory[0].ItemName != "Empty Slot"){
                tempInventory[1] = item;
            }
            else{
                tempInventory[0] = item;
            }
            sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
        }
        else if(sceneName == "give"){
            // check if user has items,  if yes run item choice, if no run no items
            let inventorycheck =  JSON.parse(sessionStorage.getItem("inventory"));
            let inventoryOk = false;
            if(inventorycheck[0].ItemID != 0){
                inventoryOk = true;
            }
            else if(inventorycheck[1].ItemID != 0){
                inventoryOk = true;
            }
            if (!inventoryOk){
                // run no items
                //alert("no items in inventory");
                transitionToScene("NoItems");
            }
            else{
                // run choice
                //alert("you have items");
                transitionToScene("GiveItem");
            }

        }
        else if(sceneName == "GiveItem"){
            options.innerHTML = "";
            let inventorycheck = JSON.parse(sessionStorage.getItem("inventory"));
            let itemcount = 0;
            let indexes = [];
            if(inventorycheck[0].ItemID != 0){
                itemcount+=1;
                indexes.push(0);
            }
            if(inventorycheck[1].ItemID != 0){
                itemcount+=1;
                indexes.push(1);
            }
            if(itemcount==1){
                const img1 = document.createElement("img");
                img1.src = inventorycheck[indexes[0]].ImagePath;
                img1.alt = inventorycheck[indexes[0]].ItemName;
                img1.style.cursor = "pointer";
                img1.style.width = "250px";
                img1.onclick = () => {console.log("clicked");logItemChoice(inventorycheck[indexes[0]].ItemID);};
                options.appendChild(img1);
            }
            else if (itemcount==2){
                const img1 = document.createElement("img");
                img1.src = inventorycheck[indexes[0]].ImagePath;
                img1.alt = inventorycheck[indexes[0]].ItemName;
                img1.style.cursor = "pointer";
                img1.style.width = "250px";
                img1.onclick = () => {console.log("clicked");logItemChoice(inventorycheck[indexes[0]].ItemID);};
                options.appendChild(img1);

                const img2 = document.createElement("img");
                img2.src = inventorycheck[indexes[1]].ImagePath;
                img2.alt = inventorycheck[indexes[1]].ItemName;
                img2.style.cursor = "pointer";
                img2.style.width = "250px";
                img2.onclick = () => {console.log("clicked");logItemChoice(inventorycheck[indexes[1]].ItemID);};
                options.appendChild(img2);
            }

            gameText.textContent = currentScene.text;
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.style.display = "block";
                button.style.margin = "0 auto";
                button.onclick = () => transitionToScene(option.nextScene);
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;

        }
        else if(sceneName == "Character1Accusation" || sceneName == "Character2WrongAccusation"|| sceneName == "Character3WrongAccusation"|| 
            sceneName == "Character4WrongAccusation"|| sceneName == "Character5WrongAccusation"|| sceneName == "Character6WrongAccusation"){
            gameText.textContent = currentScene.text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => endGame();
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }
        else {
            if(sceneName == "Character1Discuss"){
    
                // get json from session, add interaction, add back to session storage
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("1_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character1Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("1_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character2Discuss"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("2_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character2Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("2_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character3Discuss"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("3_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character3Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("3_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character4Discuss"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("4_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character4Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("4_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character5Discuss"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("5_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character5Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("5_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character6Discuss"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("6_1");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character6Confront"){
                let interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
                interactionsArr.push("6_2");
                sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            }
            else if(sceneName == "Character1"){
                sessionStorage.setItem("currentCharacter", 1);
            }
            else if(sceneName == "Character2"){
                sessionStorage.setItem("currentCharacter", 2);
            }
            else if(sceneName == "Character3"){
                sessionStorage.setItem("currentCharacter", 3);
            }
            else if(sceneName == "Character4"){
                sessionStorage.setItem("currentCharacter", 4);
            }
            else if(sceneName == "Character5"){
                sessionStorage.setItem("currentCharacter", 5);
            }            
            else if(sceneName == "Character6"){
                sessionStorage.setItem("currentCharacter", 6);
            }else if(sceneName =="investigation_main" || sceneName=="investigation_opening"){
                sessionStorage.setItem("saveOK", true);
            }

            gameText.textContent = currentScene.text;
            options.innerHTML = "";
            currentScene.options.forEach((option) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => transitionToScene(option.nextScene);
                options.appendChild(button);
            });
    
            gameImage.src = currentScene.image;
            imageDescription.textContent = currentScene.imageDescription;
        }
    
        inventoryList.innerHTML = "";
        for(let i =0;i<2;i++){
            const li = document.createElement("li");
            const img = document.createElement("img");
    
            img.src = gameState.inventory[i].ImagePath;
            img.alt = gameState.inventory[i].ItemName;
            img.style.width = "100px";
    
            li.appendChild(img);
            inventoryList.appendChild(li);
    
        }
    }
}

function logItemChoice(ID){
    sessionStorage.setItem("chosenItem", ID);
    checkItem();
}

// Toggle menu popup
function toggleMenu() {
    const menuPopup = document.getElementById("menu-popup");
    menuPopup.style.display =
        menuPopup.style.display === "none" ? "block" : "none";
}

// Quit to main menu
function quitToMainMenu() {
    window.location.href = "landing.html";
}


function runAccuseMinigame(ending) {
    sessionStorage.setItem("winEnding", ending);
    window.location.href = "minesweeper.html";
}

function timeOutEnd(){
    sessionStorage.setItem("winEnding",3);
    finalTime();
    const soundEffect = new Audio("audio/fuzzy-jumpscare-80560.mp3");
    soundEffect.play();
    window.location.href = "jumpscare.html";
}

function timeOutEndBackup(){
    sessionStorage.setItem("winEnding",3);
    endGame();
}

function checkItem(){
    // check current character
    let character = sessionStorage.getItem("currentCharacter");
    // check chosen item
    let item  =  sessionStorage.getItem("chosenItem");
    // respond as such
    let interactionsArr;
    switch(character){
        case '1':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("1_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '1'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '1'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));

                // play character response
                transitionToScene("Character1CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character1WrongItem");
            }
            break;
        case '2':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("2_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '2'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '2'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                // play character response
                transitionToScene("Character2CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character2WrongItem");
            }
            break;
        case '3':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("3_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '3'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '3'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                // play character response
                transitionToScene("Character3CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character3WrongItem");
            }
            break;
        case '4':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("4_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '4'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '4'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                // play character response
                transitionToScene("Character4CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character4WrongItem");
            }
            break;
        case '5':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("5_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '5'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '5'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                // play character response
                transitionToScene("Character5CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character5WrongItem");
                
            }
            break;
        case '6':
            interactionsArr = JSON.parse(sessionStorage.getItem("interactionsArr"));
            interactionsArr.push("6_3");
            sessionStorage.setItem("interactionsArr", JSON.stringify(interactionsArr));
            if(item == '6'){
                // remove item from inventory
                let tempInventory = JSON.parse(sessionStorage.getItem("inventory"));
                if(tempInventory[0].ItemID == '6'){
                    tempInventory[0] = emptyItem;
                }
                else{
                    tempInventory[1] = emptyItem;
                }
                sessionStorage.setItem("inventory", JSON.stringify(tempInventory));
                // play character response
                transitionToScene("Character6CorrectItem");
            }
            else {
                // play character response
                transitionToScene("Character6WrongItem");
            }
            break;
    }
}

function endGame(){
    finalTime();
    window.location.href = "Ending.html";
}

function menuSaveButton(){
    if(sessionStorage.getItem("saveOK") == 'true'){
        saveGame(false);
        alert("Game Saved. Returning to Menu.")
        quitToMainMenu();
    }
    else{
        alert("Game cannot be saved until you have finished the introduction. Please save after you begin the Investigation.");
    }
}

function runSnake(){
    sessionStorage.setItem("playingSnake",true);
    window.location.href = "snake.html";
}


function runBlackjack(){
    sessionStorage.setItem("playingBlackjack",true);
    window.location.href = "blackj.html";
}

function runRockPaperScissors(){
    sessionStorage.setItem("playingRockPaperScissors", true);
    window.location.href = "rockpaperscissors.html";
}


// Initialize the game display
//loadGameState();
//if(parseInt(sessionStorage.getItem("energy"))>0){
//   updateGameDisplay();
//}

// Expose functions to global scope for use in UI
window.toggleMenu = toggleMenu;
window.showLoadPopup = showLoadPopup;
window.closeLoadPopup = closeLoadPopup;
window.quitToMainMenu = quitToMainMenu;
