let image = document.getElementById("image");
let container = document.getElementById("imageContainer");

let isVisible = true;
const soundEffect = new Audio("audio/fuzzy-jumpscare-80560.mp3");

document.addEventListener("DOMContentLoaded", function()
{
    if(sessionStorage.getItem("psMode") == "false") {
        const flashInterval = setInterval(() => {
            if(isVisible)
            {
                image.style.opacity = "0";
                container.style.backgroundColor = "white";
                document.body.style.backgroundColor = "white";
            }

            else
            {
                image.style.opacity = "1";
                document.body.style.backgroundColor = "black";
            }
            isVisible = !isVisible;
        }, 100);
    }
    setTimeout(() => {
        window.location.href = "Ending.html";
    }, 3000)
});

