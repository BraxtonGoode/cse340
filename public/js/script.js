const passButton = document.querySelector('#passButton');
passButton.addEventListener("click", function() {
    const passwordInput = document.getElementById("account_password");
    const type = passwordInput.getAttribute("type");
    if (type == "password") {
        passwordInput.setAttribute("type", "text");
        passButton.innerHTML = "Hide Password"
    } else {
        passwordInput.setAttribute("type", "password");
        passButton.innerHTML = "Show Password";
    }
});