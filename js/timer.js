//Game Timer for updating completion time NOT WORKING
let startDate = new Date();
let elapsedTime = 0;
try{
    elapsedTime = parseInt(sessionStorage.getItem("completionTime"));
}
catch{console.log("No completion time found in session storage.");
    elapsedTime = 0;
}

const focus = function() {
   startDate = new Date();
};

const beforeunload = function() {
    const endDate = new Date();
    const spentTime = endDate.getTime() - startDate.getTime();
    elapsedTime += spentTime;
    sessionStorage.setItem("completionTime", elapsedTime);
    // elapsedTime contains the time spent on page in milliseconds
};

function saveTime() {
    const endDate = new Date();
    const spentTime = endDate.getTime() - startDate.getTime();
    elapsedTime += spentTime;
    sessionStorage.setItem("completionTime", elapsedTime);
}

function finalTime() {
    const endDate = new Date();
    const spentTime = endDate.getTime() - startDate.getTime();
    elapsedTime += spentTime; 
    sessionStorage.setItem("finalCompletionTime", elapsedTime);
}

window.addEventListener('focus', focus);
window.addEventListener('beforeunload', beforeunload);
