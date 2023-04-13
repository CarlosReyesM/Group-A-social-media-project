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
const postElement = document.querySelector(".posts");
const postsClass = new Posts();
/************************************************************ */
// POST
const btnPost = document.getElementById("btn__post");
const favoriteBtn = document.getElementById("btn__favourite");
const posts = [
    {
        author: "Fabrizio Romano",
        nametag: "FabrizioRomano",
        time: "28d",
        content: " Sergio Agüero on Messi and Barça again: “If president Laporta makes the step, I think Messi’s return to Barcelona will come closer”. 🇦🇷 #FCB Messi has completed 800 career goals last night by scoring vs Panama… …and has no full agreement with PSG on new deal, at this stage.",
        image: "https://firebasestorage.googleapis.com/v0/b/twitter-fb3ea.appspot.com/o/user2.jpg?alt=media&token=96bb8c47-4801-49c1-b798-eecbfcc3ab8e",
        commentNumber: "1.8K",
        retweetNumber: "16,8K",
        favoriteNumber: "84,5K",
        imagesPost: ["https://firebasestorage.googleapis.com/v0/b/twitter-fb3ea.appspot.com/o/post-img-1.jpg?alt=media&token=c51907a4-a793-4f18-8e37-1a83deee0a7c"],
    },
    {
        author: "CS2",
        nametag: "CounterStrike",
        time: "7d",
        content: " The Paris Major will be the final CS:GO Major. The following Major will be in March 2024 and the first in Counter-Strike 2.",
        image: "images/user5.jpg",
        commentNumber: "1.8K",
        retweetNumber: "16,8K",
        favoriteNumber: "84,5K",
        imagesPost: [],
    },
];
btnPost === null || btnPost === void 0 ? void 0 : btnPost.addEventListener("click", () => {
    const contentInputPost = inputPost.value;
    console.log(contentInputPost);
    postsClass.createPost(contentInputPost);
    modal.style.display = "none";
    modalWrapper.classList.remove("modal-wrapper-display");
});
favoriteBtn === null || favoriteBtn === void 0 ? void 0 : favoriteBtn.addEventListener("click", () => {
    favoriteBtn.classList.toggle("heart-filled");
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
