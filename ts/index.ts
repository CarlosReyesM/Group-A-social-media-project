import Posts from "./classes/posts.js";

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
const modalPostBtn = <HTMLElement>(
  document.querySelector(".modal-header button")
);
const modalFooterPlus = <HTMLElement>(
  document.querySelector(".modal-footer span")
);
const modalInput = <HTMLInputElement>document.querySelector(".modal-input");
const user = <HTMLElement>document.querySelector(".user");
const sidebar = <HTMLElement>document.querySelector(".sidebar");
const sidebarWrapper = <HTMLElement>document.querySelector(".sidebar-wrapper");
const xBtn = <HTMLElement>document.querySelector(".sidebar-header i");
const toggle = <HTMLElement>document.querySelector(".toggle");
const circle = <HTMLElement>document.querySelector(".circle");
const passwordInput = <HTMLElement>document.getElementById("password");
const passwordToggle = <HTMLElement>document.querySelector(".password-toggle");
const inputPost = <HTMLInputElement>document.querySelector("#input__post");

const postsClass = new Posts();

const goToLoginPage = () => {
  mainPage.style.display = "none";
  loginPage.style.display = "grid";
};

const goToMainPage = () => {
  mainPage.style.display = "none";
  newsFeedPage.style.display = "block";
  postsClass.fetchPosts();
};

const checkForCredentials = () => {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn) {
    goToMainPage();
    return;
  }
  goToLoginPage();
}

checkForCredentials();

/************************************************************ */
// POST

const btnPost = <HTMLElement>document.getElementById("btn__post");

btnPost?.addEventListener("click", () => {
  const contentInputPost = inputPost.value;
  console.log(contentInputPost);

  postsClass.createPost(contentInputPost);

  modal.style.display = "none";
  modalWrapper.classList.remove("modal-wrapper-display");
});

//Main Page

passwordToggle.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  passwordToggle.classList.toggle("fa-eye");
});

const saveCredentials = () => {
  localStorage.setItem("loggedIn", "true")
}


middleContent.addEventListener("click", (e) => {
  const target = e.target as HTMLDivElement;
  if (target.classList[1] === "main-btn") {
    goToLoginPage();
  }
});

btnTop.addEventListener("click", async () => {
  const inputUserInfo = <HTMLInputElement>document.querySelector(".user-info");
  const inputPassword = <HTMLInputElement>document.querySelector("#password");

  if (inputUserInfo.value !== "" && inputPassword.value !== "") {
    // TODO handle user authentication
    saveCredentials();
    goToMainPage();
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
  const loginUserInfo = <HTMLInputElement>(
    document.querySelector(".login-user-info")
  );
  const loginPassword = <HTMLInputElement>(
    document.querySelector(".login-password")
  );

  if (loginUserInfo.value !== "" && loginPassword.value !== "") {
    // TODO handle user authentication
    saveCredentials();
    goToMainPage();
  } else {
    loginModal.style.display = "block";
  }
});

// News Feed Page
// Post modal
postBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalWrapper.classList.add("modal-wrapper-display");
  inputPost.placeholder = "What's happening?"
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

const followBtns = document.querySelectorAll(
  ".follow-btn"
) as NodeListOf<HTMLButtonElement>;

for (const followBtn of followBtns) {
  followBtn.addEventListener("click", function () {
    followBtn.classList.toggle("followed");

    if (followBtn.classList.contains("followed")) {
      followBtn.textContent = "Followed";
      followBtn.classList.add("unfollowed");
    } else {
      followBtn.textContent = "Follow";
      followBtn.classList.remove("unfollowed");
    }
  });

  followBtn.addEventListener("mouseenter", function () {
    if (followBtn.classList.contains("followed")) {
      followBtn.textContent = "Unfollow";
      followBtn.classList.add("unfollowed");
    }
  });

  followBtn.addEventListener("mouseleave", function () {
    if (followBtn.classList.contains("followed")) {
      followBtn.textContent = "Followed";
      followBtn.classList.remove("unfollowed");
    }
  });
}
