//DOM Elements
var mainPage = document.querySelector(".main-page");
var loginPage = document.querySelector(".login-page");
var middleContent = document.querySelector(".middle-content");
var btnTop = document.querySelector(".btn-top");
var newsFeedPage = document.querySelector(".feeds-page");
var loginModal = document.querySelector(".login-modal");
var modalX = document.querySelector(".login-modal i");
var loginFormBtn = document.querySelector(".login-form-btn");
var postBtn = document.querySelector(".post-btn");
var modalWrapper = document.querySelector(".modal-wrapper");
var modal = document.querySelector(".modal");
var postModalX = document.querySelector(".modal-header i");
var modalPostBtn = document.querySelector(".modal-header button");
var modalFooterPlus = document.querySelector(".modal-footer span");
var modalInput = document.querySelector(".modal-input");
var user = document.querySelector(".user");
var sidebar = document.querySelector(".sidebar");
var sidebarWrapper = document.querySelector(".sidebar-wrapper");
var xBtn = document.querySelector(".sidebar-header i");
var toggle = document.querySelector(".toggle");
var circle = document.querySelector(".circle");
var passwordInput = document.getElementById('password');
var passwordToggle = document.querySelector('.password-toggle');
/************************************************************ */
//Main Page
passwordToggle.addEventListener('click', function () {
    var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    passwordToggle.classList.toggle('fa-eye');
});
var goToLoginPage = function () {
    mainPage.style.display = "none";
    loginPage.style.display = "grid";
};
middleContent.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList[1] === "main-btn") {
        goToLoginPage();
    }
});
btnTop.addEventListener("click", function () {
    var inputUserInfo = document.querySelector(".user-info");
    var inputPassword = document.querySelector("#password");
    if (inputUserInfo.value !== "" && inputPassword.value !== "") {
        mainPage.style.display = "none";
        newsFeedPage.style.display = "block";
    }
    else {
        goToLoginPage();
        loginModal.style.display = "block";
    }
});
//Login Page
modalX.addEventListener("click", function () {
    loginModal.style.display = "none";
});
loginFormBtn.addEventListener("click", function () {
    var loginUserInfo = document.querySelector(".login-user-info");
    var loginPassword = document.querySelector(".login-password");
    if (loginUserInfo.value !== "" && loginPassword.value !== "") {
        loginPage.style.display = "none";
        newsFeedPage.style.display = "block";
    }
    else {
        loginModal.style.display = "block";
    }
});
// News Feed Page
// Post modal
postBtn.addEventListener("click", function () {
    modal.style.display = "block";
    modalWrapper.classList.add("modal-wrapper-display");
    if (modalInput.value !== "") {
        modalInput.value = "";
        changeOpacity(0.5);
    }
});
var changeOpacity = function (x) {
    modalPostBtn.style.opacity = String(x);
    modalFooterPlus.style.opacity = String(x);
};
postModalX.addEventListener("click", function () {
    modal.style.display = "none";
    modalWrapper.classList.remove("modal-wrapper-display");
});
modalInput.addEventListener("keypress", function (e) {
    if (modalInput.value !== "") {
        changeOpacity(1);
    }
});
modalInput.addEventListener("blur", function (e) {
    if (modalInput.value === "") {
        changeOpacity(0.5);
    }
});
//Sidebar
user.addEventListener("click", function () {
    sidebar.classList.add("sidebar-display");
    sidebarWrapper.classList.add("sidebar-wrapper-display");
});
xBtn.addEventListener("click", function () {
    sidebar.classList.remove("sidebar-display");
    sidebarWrapper.classList.remove("sidebar-wrapper-display");
});
// dark-Mode
var darkElements1 = document.querySelectorAll(".dark-mode-1");
var darkElements2 = document.querySelectorAll(".dark-mode-2");
var lightTexts = document.querySelectorAll(".light-text");
var borders = document.querySelectorAll(".border");
toggle.addEventListener("click", function () {
    circle.classList.toggle("move");
    Array.from(darkElements1).map(function (darkEl1) {
        return darkEl1.classList.toggle("dark-1");
    });
    Array.from(darkElements2).map(function (darkEl2) {
        return darkEl2.classList.toggle("dark-2");
    });
    Array.from(lightTexts).map(function (lightText) {
        return lightText.classList.toggle("light");
    });
    Array.from(borders).map(function (border) { return border.classList.toggle("border-color"); });
});
