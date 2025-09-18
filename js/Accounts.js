// LOGIN LISTENER // 

document.getElementById("LoginAccount").addEventListener("submit", async function (event) {
  event.preventDefault();
  let username = "";
  let password = "";
  try{
    username = document.getElementById("loginUsernameCreate").value;
  }
  catch{}
  try{
    password = document.getElementById("loginPasswordCreate").value;
  }
  catch{}
  //Checks the database to see if a matching username and password can be found.
  let sqlQuery = `SELECT UserID, Username FROM USER WHERE Username = '${username}' AND Password = '${password}'`;
  dbConfig.set('query', sqlQuery);
  try {
    let response = await fetch(dbConnectorUrl, {
        method: "POST",
        body: dbConfig
    });
    let result = await response.json();

    if (result.success && result.data.length > 0) {
      let bigtext = sessionStorage.getItem("biggerText");
      sessionStorage.clear();
      let user = result.data[0];
      sessionStorage.setItem("userID", user.UserID);
      sessionStorage.setItem("username", user.Username);
      sessionStorage.setItem("loggedIn",true);
      sessionStorage.setItem("biggerText", bigtext);
      document.getElementById("LoginMessage").textContent = "Welcome, " + user.Username;
      loggedIn = true;
    } else {
      document.getElementById("LoginMessage").textContent = "Invalid username or password.";
      loggedIn = false;
    }
  } catch (error) {
    console.error("Error completing login:", error);
    loggedIn = false;
  }
});


// NEW ACCOUNT LISTENER //


document.getElementById("creatingAccount").addEventListener("submit", async function (event) {
  event.preventDefault();
  let username = "";
  let password = "";
  let confirmPassword = "";
  try{
    username = document.getElementById("registerUsernameCreate").value;
  } catch{

  }
  try{
    password = document.getElementById("registerPasswordCreate").value;
  } catch{

  }
  try{
    confirmPassword = document.getElementById("passwordCreateCheck").value;
  } catch{

  }

  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`); //Print to console for debug purposes
  console.log(`Confirm Password: ${confirmPassword}`);


  // input validation
  let validInput = checkInputValidity(true, username,password, confirmPassword);
  if(validInput){
    //This query will check to see if the username already exists in the database.
    let selectQuery = `SELECT UserID FROM USER WHERE username = '${username}'`;
    dbConfig.set('query', selectQuery);
    try {
        let checkResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let checkResult = await checkResponse.json();
        //If the username already exists in the database, an error is displayed.
        if (checkResult.success && checkResult.data.length > 0) {
            document.getElementById("createMessage").textContent =
            "Username already exists.";
            return;
        }
    } catch (error) {
        console.error("Error checking for existing accounts:", error);
    }

    //This query adds the new user credentials to the database.
    let insertQuery = `INSERT INTO USER(Username, Password, TotalGames) VALUES ('${username}', '${password}', 0)`;
    dbConfig.set('query', insertQuery);
    try {
        let insertResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let insertResult = await insertResponse.json();
        if (insertResult.success) {
            document.getElementById("registerMessage").textContent = "Registration successful!";
            document.getElementById("creatingAccount").reset();
        } else {
            document.getElementById("createMessage").textContent = "Error registering user.";
        }
    } catch (error) {
        console.error("Error registering user:", error);
    }
  }
  else {
    //document.getElementById("createMessage").textContent = "Invalid Input.";
  }
  
});

// VALIDATION FUNCTIONS //

// function to show/hide toggle password fields

/*function showPassword() {
  let showButton = document.getElementById("passwordShowHide");
  let x = document.getElementById("passwordCreate");
  if (x.type === "password") {
    x.type = "text";
    showButton.style.backgroundColor = '#ff6666';
  } else {
    x.type = "password";
    showButton.style.backgroundColor = '#333';
  }
  let y = document.getElementById("passwordCreateCheck");
  if (y.type === "password") {
    y.type = "text";
  } else {
    y.type = "password";
  }
}*/
//^ Original function for button based show password


//New function for checkbox based show password
  document.getElementById("loginPasswordShowHide").addEventListener("change", function() {

    let passwordField = document.getElementById("loginPasswordCreate");
    let showPasswordCheckbox = document.getElementById("loginPasswordShowHide");
    
    if(this.checked)
    {
      passwordField.type = "text";
    }

    else
    {
      passwordField.type = "password";
    }
  });

  document.getElementById("registerPasswordShowHide").addEventListener("change", function() {

    let passwordField = document.getElementById("registerPasswordCreate");
    let confirmPasswordField = document.getElementById("passwordCreateCheck");
    let showPasswordCheckbox = document.getElementById("resgiterPasswordShowHide");
    
    if(this.checked)
    {
      passwordField.type = "text";
      confirmPasswordField.type = "text";
    }

    else
    {
      passwordField.type = "password";
      confirmPasswordField.type = "password";
    }
  });




// function checks if the two password fields match
function checkMatch() {
  let valid = true;
  console.log("Running check")
  if (document.getElementById("registerPasswordCreate").value != document.getElementById("passwordCreateCheck").value) {
      valid = false;
  }
  console.log(`Password match: ${valid}`);
  return valid;
}

// function validates data entry
function checkInputValidity(create,u,p,cp) {
  //debug log to check function runs
  console.log("Running Validation");
  let username = u;
  let password = p;
  let confirmPassword = cp;
  let valid = true;
  // check username not null
  try{
    if(username == ""){
      valid = false;
      document.getElementById("registerMessage").textContent =('Username cannot be empty');
    }
    else if (username.length>20){
      valid = false;
      document.getElementById("registerMessage").textContent =("Username must be 20 characters or less.");
    }
  }
  catch {
    alert('EXCEPTION Username cannot be empty');
    valid = false;
  }
  // if username not null, check password not null
  if(valid){
    try{
      if(password == ""){
        valid = false;
        document.getElementById("registerMessage").textContent =('password cannot be empty');
      }
    }
    catch{
      alert('EXCEPTION Password cannot be empty');
      valid = false;
    }
    // if password not null and username not null check passwords match, only check if creating/updating details
    if(create){
      if(valid){
        valid=checkMatch(confirmPassword,password);
        if(!valid){
          document.getElementById("registerMessage").textContent =('Passwords must match.');
        }
      }
    }
    // if passwords match, check they contain only letters, numbers or specific symbols to avoid insertion
    if(valid){
      let passwordResult = strongValidPassword(password);
      switch(passwordResult){
        case 1:
          // too short
          document.getElementById("registerMessage").textContent =('password must be between 6 and 50 characters. Too short.');
          valid = false;
          break;
        case 2:
          // too long
          document.getElementById("registerMessage").textContent =('password must be between 6 and 50 characters. Too long.');
          valid = false;
          break;
        case 3:
          // no numbers
          document.getElementById("registerMessage").textContent =('password must contain numbers');
          valid = false;
          break;
        case 4:
          // no letters
          document.getElementById("registerMessage").textContent =('password must contain letters');
          valid = false;
          break;
        case 5:
          // bad symbols
          document.getElementById("registerMessage").textContent = 'password pasword may only have ?!#$_ symbols';
          valid = false;
          break;
        default:
          // good password
      }
    }
  }
  if(valid){
    //createAccount(username,password);
  }
  return valid;
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

function toggleForms()
{
    document.getElementById("LoginMain").classList.toggle("hidden");
    document.getElementById("createAccountMain").classList.toggle("hidden");
}

function chooseForm(){
  if(sessionStorage.getItem("loginpageload") == 'false'){
    toggleForms();
    sessionStorage.removeItem("loginpageload");
  }
}

