// Function to handle account deletion
async function deleteAccount(username, password) 
{
    if (username === "" || password === "") 
    {
        return "Username and password cannot be empty.";
    }

    //Retrieve the UserID for the given username and password
    let sqlQuery = `SELECT UserID FROM USER WHERE Username = '${username}' AND Password = '${password}'`;
    dbConfig.set('query', sqlQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let result = await response.json();

        if (!result.success || result.data.length === 0) {
            return "Invalid username or password.";
        }

        const userID = result.data[0].UserID;

        //Confirm deletion with the user
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmation) {
            return "Account deletion cancelled.";
        }
        else{
            // CASCADE DELETE MEANS DELETING GAME WILL DELETE INTERACTIONS AND ACCUSATIONS
            // CASCADE DELETE MEANS DELETING USER WILL DELETE GAME
            sqlQuery = `DELETE FROM USER WHERE UserID = ${userID}`;
            dbConfig.set('query', sqlQuery);
            try {
                let deleteResponse = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });
                let deleteResult = await deleteResponse.json();
    
                if (deleteResult.success) {
                    let bigtext = sessionStorage.getItem("biggerText");
                    sessionStorage.clear(); // Clear session storage
                    sessionStorage.setItem("biggerText", bigtext);
                    console.log("Account deleted successfully,  you  have been logged out.");
                    document.getElementById("deleteAccountMessage").textContent = "Account deleted, you are now logged out.";
                    document.getElementById("deleteAccountForm").reset();
                } else {
                    console.log("Error deleting account.");
                    document.getElementById("deleteAccountMessage").textContent ="Error deleting account.";
                }
            }
            catch{
                console.log("Error caught while deleting account.");
                document.getElementById("deleteAccountMessage").textContent ="Error deleting account.";
            }
        }
    }
    catch {console.log("An error occured in account");
        document.getElementById("deleteAccountMessage").textContent ="Error locating account.";
    }

}
// Function to show/hide password in the delete account form
function toggleDeletePasswordVisibility() {
    let passwordField = document.getElementById("passwordDelete");
    let showPasswordCheckbox = document.getElementById("deletePasswordShowHide");

    if (showPasswordCheckbox.checked) {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

// Add event listener for the delete account form
document.addEventListener("DOMContentLoaded", function () {
    const deleteAccountForm = document.getElementById("deleteAccountForm");
    if (deleteAccountForm) {
        deleteAccountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            let username = document.getElementById("usernameDelete").value;
            let password = document.getElementById("passwordDelete").value;

            const result = await deleteAccount(username, password);
            document.getElementById("deleteMessage").textContent = result;

            if (result === "Account deleted successfully.") {
                setTimeout(() => {
                    window.location.href = "landing.html"; // Redirect to main menu
                }, 2000);
            }
        });
    }

    // Add event listener for the show/hide password checkbox
    const deletePasswordShowHide = document.getElementById("deletePasswordShowHide");
    if (deletePasswordShowHide) {
        deletePasswordShowHide.addEventListener("change", toggleDeletePasswordVisibility);
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

function updateAccountPage(){
    window.location.href = "updateAccount.html";
}