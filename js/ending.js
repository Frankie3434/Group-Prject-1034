function toggleForms(ending)
{
    switch(ending){
        case '1':
            document.getElementById("Ending1").style.visibility = "visible";
            document.getElementById("Ending2").style.visibility = "hidden";
            document.getElementById("Ending3").style.visibility = "hidden";
            document.getElementById("EndingTitle").textContent =   "Good Ending";
            document.getElementById("Conclusion").textContent =   "Your argument was strong and your suspicions correct.\r\nThe party apprehends Edmund just in time for the phone lines being repaired.\r\nThe authorities are called and the culprit arrested.\r\nCongratulations!\r\nCan you find the other two endings?";
            break;
        case '2':
            document.getElementById("Ending1").style.visibility = "hidden";
            document.getElementById("Ending2").style.visibility = "visible";
            document.getElementById("Ending3").style.visibility = "hidden";
            document.getElementById("EndingTitle").textContent =   "Bad Ending";
            document.getElementById("Conclusion").textContent =   "Your argument was weak and your accusations incorrect.\r\nThe party becomes suspicious of you and decide you are the culprit.\r\nThe real criminal has got off scot free.\r\nCan you find the other two endings?";
            break;
        case '3':
            document.getElementById("Ending1").style.visibility = "hidden";
            document.getElementById("Ending2").style.visibility = "hidden";
            document.getElementById("Ending3").style.visibility = "visible";
            document.getElementById("EndingTitle").textContent =   "Out of Time";
            document.getElementById("Conclusion").textContent =   "You took too long to make a decision. The backup generator fails,\r\nthe lights go out and the party is plunged into darkness.\r\nYour investigation has made you a problem.\r\nIt's likely you won't make it till the power comes back on...\r\nCan you find the other two endings?";
            break;
    }

    document.getElementById("Time").textContent = "Completion  Time: " + toHHMMSS(sessionStorage.getItem("finalCompletionTime"));
    document.getElementById("Energy").textContent = "Energy Remaining: " + sessionStorage.getItem("energy");
    
}

function displayEnding(){
    finalTime();
    
    let ending = sessionStorage.getItem("winEnding");
    toggleForms(ending);
    sessionStorage.setItem("ending",ending);
    if(!sessionStorage.getItem("finalsavedone")){
        saveGame(true);
        sessionStorage.setItem("finalsavedone", true);
    }
    console.log("refresh occured");
}

// function to convert the completion time in session storage to a displayable time
function toHHMMSS(timeinput) {
	var sec_num = parseInt(timeinput / 1000); // don't forget the second param
	var secsUsed = 0;
    
    var years = Math.floor(sec_num / 31536000);
    if (years>0)
    {
        secsUsed += (years * 31536000);
    }
    
    var months = Math.floor((sec_num - secsUsed) / 2628288); //days*30.42 - average number of days
    if (months>0)
    {
        secsUsed += (months * 2628288);
    }
    
    var weeks = Math.floor((sec_num - secsUsed) / 604800);
    if (weeks>0)
    {
        secsUsed += (weeks * 604800);
    }
    
    var days = Math.floor((sec_num - secsUsed) / 86400);
    if (days>0)
    {
        secsUsed += (days * 86400);
    }
    
    var hours = Math.floor((sec_num - secsUsed) / 3600);
    if (hours>0)
    {
        secsUsed += (hours * 3600);
    }
    
    var minutes = Math.floor((sec_num - secsUsed) / 60);
    if (minutes>0)
    {
        secsUsed += (minutes * 60);
    }
    
    var seconds = sec_num - secsUsed;
	
    //Now determine what to display
    
	if (years>0) {
        return years+' Yrs '+months+' Mths '+weeks+' Wks '+days+' D '+hours+' H '+minutes+' Min '+seconds + ' s';
    } else if (months>0) {
        return months+' Mths '+weeks+' Wks '+days+' D '+hours+' H '+minutes+' Min '+seconds + ' s';
    } else if (weeks>0) {
        return weeks+' Wks '+days+' D '+hours+' H '+minutes+' Min '+seconds + ' s';
    } else if (days>0){
		//hours=hours-(24 * days);    //Fix 02/04/2019
        return days+' D '+hours+' H '+minutes+' Min '+seconds + ' s';
	} else if (hours>0) {
		return hours+' H '+minutes+' Min '+seconds + ' s';
	} else if (minutes>0) {
		return minutes+' Min '+seconds + ' s';
	} else if (seconds>0) {
		return seconds + ' s';
	} else if (seconds==0) {
		return this + ' ms (not enough for seconds!)';
	} else {
		return days+' D '+hours+' H '+minutes+' Min '+seconds + ' s';
	}
}

function quitToMainMenu() {
    window.location.href = "landing.html";
}




