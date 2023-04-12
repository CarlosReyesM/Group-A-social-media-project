// import {fetchStories} from "./fetchStories.js"

//DOM Elements
const mainPage = <HTMLElement>document.querySelector(".main-page");
const loginPage = <HTMLElement>document.querySelector(".login-page");
const middleContent = <HTMLDivElement>document.querySelector(".middle-content");
const btnTop = <HTMLButtonElement>document.querySelector(".btn-top");
const newsFeedPage = <HTMLElement>document.querySelector(".feeds-page");
const loginModal = <HTMLElement>document.querySelector(".login-modal");
const modalX = <HTMLElement>document.querySelector(".login-modal i");
const loginFormBtn = <HTMLElement>document.querySelector(".login-form-btn");
const postBtn = <HTMLElement>document.querySelector(".post-btn");
const modalWrapper = <HTMLElement>document.querySelector(".modal-wrapper");
const modal = <HTMLElement>document.querySelector(".modal");
const postModalX = <HTMLElement>document.querySelector(".modal-header i");
const modalPostBtn = <HTMLElement>document.querySelector(".modal-header button");
const modalFooterPlus = <HTMLElement>document.querySelector(".modal-footer span");
const modalInput = <HTMLInputElement>document.querySelector(".modal-input");
const user = <HTMLElement>document.querySelector(".user");
const sidebar = <HTMLElement>document.querySelector(".sidebar");
const sidebarWrapper = <HTMLElement>document.querySelector(".sidebar-wrapper");
const xBtn = <HTMLElement>document.querySelector(".sidebar-header i");
const toggle = <HTMLElement>document.querySelector(".toggle");
const circle = <HTMLElement>document.querySelector(".circle");
const passwordInput = <HTMLElement>document.getElementById('password'); 
const passwordToggle =  <HTMLElement>document.querySelector('.password-toggle');
const inputPost = <HTMLInputElement>document.querySelector('#input__post'); 
const postElement =  <HTMLElement>document.querySelector(".posts");




/************************************************************ */
// POST

const btnPost = <HTMLElement>document.getElementById("btn__post");
const favoriteBtn = <HTMLElement>document.getElementById("btn__favourite"); 

const posts = [
  {
    author: "Fabrizio Romano",
    nametag: "FabrizioRomano",
    time: "28d",
    content:
      " Sergio Agüero on Messi and Barça again: “If president Laporta makes the step, I think Messi’s return to Barcelona will come closer”. 🇦🇷 #FCB Messi has completed 800 career goals last night by scoring vs Panama… …and has no full agreement with PSG on new deal, at this stage.",
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
    content:
      " The Paris Major will be the final CS:GO Major. The following Major will be in March 2024 and the first in Counter-Strike 2.",
    image: "images/user5.jpg",
    commentNumber: "1.8K",
    retweetNumber: "16,8K",
    favoriteNumber: "84,5K",
    imagesPost: [],
  },



];


const renderPost = () => {
  const htmls = posts
    .map((post, index) => {
      return `
    <div class="post border">
      <div class="user-avatar">
        <img src="${post.image}"/>
      </div>
      <div class="post-content">
        <div class="post-user-info light-text">
          <h4>${post.author}</h4>
          <span>@${post.nametag.trim()} . ${post.time}</span>
        </div>
        <p class="post-text light-text">
          ${post.content}  
        </p>
        <div class="post-img">
          ${post.imagesPost.map((image) => {
            return `<img src="${image}" alt="post" />`;
          })}
        </div>
        <div class="content__action">
          <span class="comment">
            <i class="far fa-comment"></i>
            <span class="comment-number">${post.commentNumber}</span>
          </span>
          <span class="retweet">
            <i class="fas fa-retweet"></i></i>
            <span class="retweet-number">${post.retweetNumber}</span>
          </span>
          <span id="btn__favourite" class="favorite">
            <i class="far fa-heart"></i>
            <span class="favorite-number">${post.favoriteNumber}</span>
          </span>
          <span class="external-link">
            <i class='bx bx-link-external'></i>
            <span class="share">Share</span>
          </span>
        </div>
      </div>
    </div>
  `;
    })
    .join("");
    
    postElement.innerHTML = htmls
};

btnPost?.addEventListener("click", () => {

  const contentInputPost = inputPost.value;
  console.log(contentInputPost);

  posts.push({
    author: "Dang Hoang Ha",
    nametag: "hha.2907",
    time: "Now",
    content: contentInputPost,
    image: "images/user1.jpg",
    commentNumber: "0",
    retweetNumber: "0",
    favoriteNumber: "0",
    imagesPost: [],
  });


  renderPost();

  modal.style.display = "none";
  modalWrapper.classList.remove("modal-wrapper-display");
});

favoriteBtn?.addEventListener("click", () => {
  favoriteBtn.classList.toggle("heart-filled");
  
});


//Main Page

passwordToggle.addEventListener('click', function() {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  passwordToggle.classList.toggle('fa-eye');
});

const goToLoginPage = () => {
  mainPage.style.display = "none";
  loginPage.style.display = "grid";
};

middleContent.addEventListener("click", (e) => {
  const target = e.target as HTMLDivElement;
  if (target.classList[1] === "main-btn") {
    goToLoginPage();
  }
});

btnTop.addEventListener("click", () => {
  const inputUserInfo = <HTMLInputElement>document.querySelector(".user-info");
  const inputPassword = <HTMLInputElement>document.querySelector("#password");

  // TODO handle user authentication
  if (inputUserInfo.value !== "" && inputPassword.value !== "") {
    mainPage.style.display = "none";
    newsFeedPage.style.display = "block";
    // fetchStories();
  } else {
    goToLoginPage();
    loginModal.style.display = "block";
  }
});

//Login Page

modalX.addEventListener("click", () => {
  loginModal.style.display = "none";
});

loginFormBtn.addEventListener("click", () => {
  const loginUserInfo = <HTMLInputElement>document.querySelector(".login-user-info");
  const loginPassword = <HTMLInputElement>document.querySelector(".login-password");

  if (loginUserInfo.value !== "" && loginPassword.value !== "") {
  // TODO handle user authentication
    loginPage.style.display = "none";
    newsFeedPage.style.display = "block";
    // fetchStories();
  } else {
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

const changeOpacity = (x: number) => {
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
  Array.from(darkElements1).map((darkEl1) =>
    darkEl1.classList.toggle("dark-1")
  );
  Array.from(darkElements2).map((darkEl2) =>
    darkEl2.classList.toggle("dark-2")
  );
  Array.from(lightTexts).map((lightText) =>
    lightText.classList.toggle("light")
  );
  Array.from(borders).map((border) => border.classList.toggle("border-color"));
});



