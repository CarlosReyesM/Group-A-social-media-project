var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Posts from "./classes/posts.js";
//DOM Elements
const mainPage = document.querySelector(".main-page");
const loginPage = document.querySelector(".login-page");
const middleContent = document.querySelector(".middle-content");
const btnTop = document.querySelector(".btn-top");
const newsFeedPage = document.querySelector(".feeds-page");
const loginModal = document.querySelector(".login-modal");
const modalX = document.querySelector(".login-modal i");
const loginFormBtn = document.querySelector(".login-form-btn");
const postBtn = document.querySelector(".post-btn");
const modalWrapper = document.querySelector(".modal-wrapper");
const modal = document.querySelector(".modal");
const postModalX = document.querySelector(".modal-header i");
const modalPostBtn = (document.querySelector(".modal-header button"));
const modalFooterPlus = (document.querySelector(".modal-footer span"));
const modalInput = document.querySelector(".modal-input");
const user = document.querySelector(".user");
const sidebar = document.querySelector(".sidebar");
const sidebarWrapper = document.querySelector(".sidebar-wrapper");
const xBtn = document.querySelector(".sidebar-header i");
const toggle = document.querySelector(".toggle");
const circle = document.querySelector(".circle");
const passwordInput = document.getElementById('password');
const passwordToggle = document.querySelector('.password-toggle');
const inputPost = document.querySelector('#input__post');
const postsClass = new Posts();
/************************************************************ */
// POST
const btnPost = document.getElementById("btn__post");
btnPost === null || btnPost === void 0 ? void 0 : btnPost.addEventListener("click", () => {
    const contentInputPost = inputPost.value;
    console.log(contentInputPost);
    postsClass.createPost(contentInputPost);
    modal.style.display = "none";
    modalWrapper.classList.remove("modal-wrapper-display");
});
//Main Page
passwordToggle.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    passwordToggle.classList.toggle("fa-eye");
});
const goToLoginPage = () => {
    mainPage.style.display = "none";
    loginPage.style.display = "grid";
};
middleContent.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList[1] === "main-btn") {
        goToLoginPage();
    }
});
btnTop.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const inputUserInfo = document.querySelector(".user-info");
    const inputPassword = document.querySelector("#password");
    if (inputUserInfo.value !== "" && inputPassword.value !== "") {
        mainPage.style.display = "none";
        newsFeedPage.style.display = "block";
        postsClass.fetchPosts();
    }
    else {
        goToLoginPage();
        loginModal.style.display = "block";
    }
}));
//Login Page
modalX.addEventListener("click", () => {
    loginModal.style.display = "none";
});
loginFormBtn.addEventListener("click", () => {
    const loginUserInfo = (document.querySelector(".login-user-info"));
    const loginPassword = (document.querySelector(".login-password"));
    if (loginUserInfo.value !== "" && loginPassword.value !== "") {
        // TODO handle user authentication
        loginPage.style.display = "none";
        newsFeedPage.style.display = "block";
        postsClass.fetchPosts();
    }
    else {
        loginModal.style.display = "block";
    }
});
// News Feed Page
// Post modal
postBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalWrapper.classList.add("modal-wrapper-display");
    if (modalInput.value !== "") {
        modalInput.value = "";
        changeOpacity(0.5);
    }
});
const changeOpacity = (x) => {
    modalPostBtn.style.opacity = String(x);
    modalFooterPlus.style.opacity = String(x);
};
postModalX.addEventListener("click", () => {
    modal.style.display = "none";
    modalWrapper.classList.remove("modal-wrapper-display");
});
modalInput.addEventListener("keypress", (e) => {
    if (modalInput.value !== "") {
        changeOpacity(1);
    }
});
modalInput.addEventListener("blur", (e) => {
    if (modalInput.value === "") {
        changeOpacity(0.5);
    }
});
//Sidebar
user.addEventListener("click", () => {
    sidebar.classList.add("sidebar-display");
    sidebarWrapper.classList.add("sidebar-wrapper-display");
});
xBtn.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-display");
    sidebarWrapper.classList.remove("sidebar-wrapper-display");
});
// dark-Mode -unfinished
const darkElements1 = document.querySelectorAll(".dark-mode-1");
const darkElements2 = document.querySelectorAll(".dark-mode-2");
const lightTexts = document.querySelectorAll(".light-text");
const borders = document.querySelectorAll(".border");
toggle.addEventListener("click", () => {
    circle.classList.toggle("move");
    Array.from(darkElements1).map((darkEl1) => darkEl1.classList.toggle("dark-1"));
    Array.from(darkElements2).map((darkEl2) => darkEl2.classList.toggle("dark-2"));
    Array.from(lightTexts).map((lightText) => lightText.classList.toggle("light"));
    Array.from(borders).map((border) => border.classList.toggle("border-color"));
});
const followBtns = document.querySelectorAll('.follow-btn');
for (const followBtn of followBtns) {
    followBtn.addEventListener('click', function () {
        followBtn.classList.toggle('followed');
        if (followBtn.classList.contains('followed')) {
            followBtn.textContent = 'Followed';
            followBtn.classList.add('unfollowed');
        }
        else {
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('unfollowed');
        }
    });
    followBtn.addEventListener('mouseenter', function () {
        if (followBtn.classList.contains('followed')) {
            followBtn.textContent = 'Unfollow';
            followBtn.classList.add('unfollowed');
        }
    });
    followBtn.addEventListener('mouseleave', function () {
        if (followBtn.classList.contains('followed')) {
            followBtn.textContent = 'Followed';
            followBtn.classList.remove('unfollowed');
        }
    });
}
