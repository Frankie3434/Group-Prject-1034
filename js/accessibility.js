function changeFont(fontFamily) {
    document.body.className = document.body.className.replace(/font-\S+/g, "");
    document.body.classList.add(`font-${fontFamily}`);
    localStorage.setItem("preferredFont", fontFamily);
}

function loadPreferences() {
    const savedFont = localStorage.getItem("preferredFont");
    const textSize = localStorage.getItem("biggerText");

    if (savedFont) {
        changeFont(savedFont);
        const fontSelect = document.getElementById("font-select");
        if (fontSelect) {
            fontSelect.value = savedFont;
        }
    }

    // Load text size preference
    const biggerTextCheckbox = document.getElementById("biggerText");
    if (biggerTextCheckbox && textSize === "true") {
        biggerTextCheckbox.checked = true;
        document.body.classList.add("bigger-text");
    }
}

function biggerTextCheck() {
    const checkbox = document.getElementById("biggerText");
    if (checkbox.checked) {
        document.body.classList.add("bigger-text");
        localStorage.setItem("biggerText", "true");
    } else {
        document.body.classList.remove("bigger-text");
        localStorage.setItem("biggerText", "false");
    }
}

document.addEventListener("DOMContentLoaded", loadPreferences);
window.addEventListener("load", loadPreferences);
