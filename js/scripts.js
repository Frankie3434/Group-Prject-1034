function startGame() {
    const startGameWindow = document.getElementById('start-game-window');
    if (startGameWindow) {
        startGameWindow.style.display = 'none';
    }
    document.querySelector('.container').style.display = 'none';
    
    const introText = document.getElementById('intro-text');
    introText.style.display = 'block';
    const paragraphs = introText.querySelectorAll('p');
    
    // Calculate total delay based on number of paragraphs
    const totalDelay = (paragraphs.length * 2000) + 2000; // 2 seconds per paragraph + extra 2 seconds
    
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.classList.add('visible');
        }, index * 2000);
    });

    // After all paragraphs are shown, redirect to landing page
    setTimeout(() => {
        window.location.href = 'landing.html';
    }, totalDelay);
}

function showLandingPage() {
    document.getElementById('intro-text').style.display = 'none';
    window.location.href = 'landing.html'; 
    //document.getElementById('playermessage').textContent = 'Logged In as ';
}

function viewProgress() {
    // Logic for viewing progress
    alert("Viewing progress...");
}

// Ensure the landing page displays correctly
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'block';
});

function loadLanding(){ 
    // clear session bar login info
    let loggedin = sessionStorage.getItem("loggedIn");
    let bigtext = sessionStorage.getItem("biggerText");
    document.getElementById("logout").style.visibility  = "hidden";
    document.getElementById("loginText").textContent  = "You are not logged in.";
    if (loggedin != "true" && loggedin != "false"){
        sessionStorage.setItem("loggedIn", false);
    }
    let username;
    let userID;
    if (loggedin == 'true'){
        userID = sessionStorage.getItem("userID");
        username = sessionStorage.getItem("username");
        document.getElementById("loginText").textContent  = `Logged in as ${sessionStorage.getItem("username")}`;
        document.getElementById("logout").style.visibility  = "visible";
    }
    sessionStorage.clear();
    sessionStorage.setItem("loggedIn", loggedin);
    if(username != null){
        sessionStorage.setItem("username", username);
    }
    else{
        sessionStorage.setItem("loggedIn", false);
    }
    if(userID != null){
        sessionStorage.setItem("userID", userID);
    }
    else{
        sessionStorage.setItem("loggedIn", false);
    }
    if(bigtext=='true'){
        document.getElementById("biggerText").checked = true;
        sessionStorage.setItem("biggerText", true);
        toggleText();
    }
}

function logout(){
    sessionStorage.clear();
    sessionStorage.setItem("loggedIn", false);
    console.log("logged out");
    window.location.href = 'landing.html'; 
}

let psMode = document.getElementById("psModeCheckbox");

let isPSModeEnabled = false;
psMode.addEventListener("change" , () => {
    isPSModeEnabled = psModeCheckbox.checked;
    sessionStorage.setItem("psMode", isPSModeEnabled);
    console.log(`Photosensitive Mode: ${isPSModeEnabled}`);
});
window.onload = function() {
    sessionStorage.setItem("psMode", false);
    loadLanding();
    toggleText();
    console.log(`Photosensitive Mode: ${sessionStorage.getItem("psMode")}`);
}