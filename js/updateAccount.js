// Function to handle account update
async function updateAccount(currentUsername, currentPassword, newUsername, newPassword, confirmPassword) {
    // Retrieve the UserID for the current username and password
    let sqlQuery = `SELECT UserID FROM USER WHERE Username = '${currentUsername}' AND Password = '${currentPassword}'`;
    dbConfig.set('query', sqlQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let result = await response.json();

        if (!result.success || result.data.length === 0) {
            return "Invalid current username or password.";
        }
        else{

            let valid = true;
            // check username not null
            try{
                if(newUsername == ""){
                valid = false;
                return 'Username cannot be empty';
                }
                else if (newUsername.length>20){
                valid = false;
                return 'Username must be 20 characters or less.';
                }
            }
            catch {
                alert('EXCEPTION Username cannot be empty');
                valid = false;
            }
            // if username not null, check password not null
            if(valid){
                try{
                if(newPassword == ""){
                    valid = false;
                    return 'password cannot be empty';
                }
                }
                catch{
                alert('EXCEPTION Password cannot be empty');
                valid = false;
                }
                // if password not null and username not null check passwords match
                if(valid){
                    valid=checkMatch(newPassword,confirmPassword);
                    if(!valid){
                        return 'Passwords must match.';
                    }
                }
                }
                // if passwords match, check they contain only letters, numbers or specific symbols to avoid insertion
                if(valid){
                let passwordResult = strongValidPassword(newPassword);
                let out = "";
                switch(passwordResult){
                    case 1:
                    // too short
                    out = 'Password too short.';
                    valid = false;
                    break;
                    case 2:
                    // too long
                    out = 'Password too long.';
                    valid = false;
                    break;
                    case 3:
                    // no numbers
                    out = 'password must contain numbers';
                    valid = false;
                    break;
                    case 4:
                    // no letters
                    out = 'password must contain letters';
                    valid = false;
                    break;
                    case 5:
                    // bad symbols
                    out = 'password may only have ?!#$_ symbols';
                    valid = false;
                    break;
                    default:
                    // good password
                }
                if(!valid){
                    return out;
                }
            }
            if(valid){
                const userID = result.data[0].UserID;
                // Update the username and password in the database
                sqlQuery = `UPDATE USER SET Username = '${newUsername}', Password = '${newPassword}' WHERE UserID = ${userID}`;
                dbConfig.set('query', sqlQuery);
                response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });
                result = await response.json();
        
                if (result.success) {
                    return "Account updated successfully.";
                } else {
                    return "Error updating account.";
                }
            }
            else{
                return "Error updating account.";
            }
        } 
    } catch (error) {
        console.error("Error updating account:", error);
        return "Error updating account.";
    }
}

// Function to show/hide password in the update account form
function toggleUpdatePasswordVisibility() {
    let passwordFields = document.querySelectorAll("#currentPassword, #newPassword, #confirmPassword");
    let showPasswordCheckbox = document.getElementById("updatePasswordShowHide");

    passwordFields.forEach(field => {
        if (showPasswordCheckbox.checked) {
            field.type = "text";
        } else {
            field.type = "password";
        }
    });
}

// Add event listener for the update account form
document.addEventListener("DOMContentLoaded", function () {
    const updateAccountForm = document.getElementById("updateAccountForm");
    if (updateAccountForm) {
        updateAccountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            let currentUsername = document.getElementById("currentUsername").value;
            let currentPassword = document.getElementById("currentPassword").value;
            let newUsername = document.getElementById("newUsername").value;
            let newPassword = document.getElementById("newPassword").value;
            let confirmPassword = document.getElementById("confirmPassword").value;

            const result = await updateAccount(currentUsername, currentPassword, newUsername, newPassword, confirmPassword);
            document.getElementById("updateMessage").textContent = result;

            if (result === "Account updated successfully.") {
                setTimeout(() => {
                    window.location.href = "landing.html"; // Redirect to main menu
                }, 2000);
            }
        });
    }

    // Add event listener for the show/hide password checkbox
    const updatePasswordShowHide = document.getElementById("updatePasswordShowHide");
    if (updatePasswordShowHide) {
        updatePasswordShowHide.addEventListener("change", toggleUpdatePasswordVisibility);
    }
});

function loginPage(){
    sessionStorage.setItem("loginpageload", true);
    window.location.href = "Accounts.html";
}

function newAccountPage(){
    sessionStorage.setItem("loginpageload", false);
    window.location.href = "Accounts.html";
}

function deleteAccountPage(){
    window.location.href = "deleteAccount.html";
}



// function to validaate password strength
function strongValidPassword(pass) {
if (pass.length < 6) 
{
  // too short
  return(1);
} 
else if (pass.length > 50) 
{
  // too long
  return(2);
} 
else if (pass.search(/\d/) == -1) 
{
  // no numbers
  return(3);
} 
else if (pass.search(/[a-zA-Z]/) == -1) 
{
  // no letters
  return(4);
} 
else if (pass.search(/[^a-zA-Z0-9\?\!\#\$\_\)]/) != -1) 
{
  // bad symbols
  return(5);
}
// pasword is valid
return(0);
}

function checkMatch(x,y) {
    let valid = true;
    console.log("Running check")
    if (x !== y) {
        valid = false;
    }
    console.log(`Password match: ${valid}`);
    return valid;
  }
