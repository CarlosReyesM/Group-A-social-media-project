import { MAIN_URL } from "../constants.js";
import { createElement, textNode } from "../helpers/documentHelper.js";
import { Post } from "../interfaces/post.js";

const postElement = <HTMLElement>document.querySelector(".posts");

export default class Posts {
  constructor() {}

  posts: Post[] = [];

  async fetchPosts() {
    // TODO get user id from JWT
    const userId = 1;
    try {
      const posts: Post[] = await fetch(
        `${MAIN_URL}/tweets/all/${userId}`
      ).then((result) => result.json());
      this.posts = posts;
      this.renderPost(posts);
    } catch (error) {
      console.error(error);
    }
  }

  async createPost(content: string, image: File | null) {
    // TODO get user id from JWT
    const userId = 1;
    const formData = new FormData();
    formData.append("userId", String(userId));
    formData.append("tweet", content);

    if (image) {
      formData.append("image", image, image.name);
    }
    await fetch(`${MAIN_URL}/tweets`, {
      method: "post",
      body: formData,
    })
      .then((result) => result.json())
      .then((post) => this.renderPost(post))
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  buildPost(post: Post) {
    const container = createElement<HTMLDivElement>("div", "post border");
    const userAvatar = createElement<HTMLDivElement>("div", "user-avatar");
    userAvatar.className = "user-avatar";
    const avatarImage = createElement<HTMLImageElement>("img");
    avatarImage.src = post.avatar || "images/user1.jpg";
    userAvatar.appendChild(avatarImage);
    const postContent = createElement<HTMLDivElement>("div", "post-content");
    const postUserInfo = createElement<HTMLDivElement>(
      "div",
      "post-user-info light-text"
    );
    const author = createElement<HTMLHeadingElement>("h4");
    const authorName = textNode(post.author);
    author.appendChild(authorName);
    const nameTag = createElement<HTMLSpanElement>("span");
    const tagAndTimeText = textNode(`@${post.nametag.trim()} . ${post.time}`);
    nameTag.appendChild(tagAndTimeText);
    postUserInfo.append(author, nameTag);

    const settings = document.createElement("div");
    settings.classList.add("settings");

    const ellipsis = document.createElement("i");
    ellipsis.classList.add("fa-solid", "fa-ellipsis");
    settings.appendChild(ellipsis);

    const options = document.createElement("div");
    options.classList.add("options");

    const editContainer = createElement<HTMLDivElement>(
      "div",
      "edit-container"
    );
    const editOption = createElement<HTMLDivElement>("div", "option-text");
    editOption.textContent = "Edit Post";
    const editIcon = createElement<HTMLDivElement>("i", "fa-solid fa-gear");
    editContainer.append(editOption, editIcon);

    options.appendChild(editContainer);

    const deleteContainer = createElement<HTMLDivElement>(
      "div",
      "delete-container"
    );
    const deleteOption = createElement<HTMLDivElement>("div", "option-text");
    const deleteIcon = createElement<HTMLDivElement>("i", "fa-solid fa-trash");
    deleteOption.textContent = "Delete Post";
    deleteContainer.append(deleteOption, deleteIcon);

    options.appendChild(deleteContainer);

    settings.appendChild(options);
    let isOptionsVisible = false;

    ellipsis.addEventListener("click", () => {
      if (isOptionsVisible) {
        options.style.display = "none";
        isOptionsVisible = false;
      } else {
        options.style.display = "block";
        isOptionsVisible = true;
      }
    });

    const modalWrapper = <HTMLElement>document.querySelector(".modal-wrapper");
    const modalPost = <HTMLElement>document.querySelector(".modal");
    const inputPost = <HTMLInputElement>document.getElementById("input__post");
    editContainer.addEventListener("click", () => {
      console.log(modalWrapper);
      console.log(editContainer);
      modalWrapper.classList.add("modal-wrapper-display");
      modalPost.style.display = "block";
      inputPost.placeholder = post.content;
    });

    const deleteWrapper = <HTMLElement>(
      document.querySelector(".delete-wrapper")
    );
    const deleteNotificationModal = <HTMLElement>(
      document.querySelector(".delete-notification-modal")
    );
    deleteContainer.addEventListener("click", () => {
      deleteNotificationModal.style.display = "block";
      options.style.display = "none";
      deleteWrapper.style.display = "block";
    });

    const cancelBtn = <HTMLElement>document.querySelector(".cancelBtn");
    cancelBtn.addEventListener("click", () => {
      deleteNotificationModal.style.display = "none";
      deleteWrapper.style.display = "none";
    });

    const postText = createElement<HTMLParagraphElement>(
      "p",
      "post-text light-text"
    );
    const postTextContent = textNode(post.content);
    postText.appendChild(postTextContent);

    postContent.append(postUserInfo, postText);

    if (post.image) {
      const imageContainer = createElement<HTMLDivElement>("div", "post-img");
      const postImage = createElement<HTMLImageElement>("img");
      postImage.src = post.image;
      imageContainer.appendChild(postImage);
      postContent.appendChild(imageContainer);
    }

    const contentAction = createElement<HTMLDivElement>(
      "div",
      "content__action"
    );
    const comments = createElement<HTMLDivElement>("div", "comment");
    const commentIcon = createElement<HTMLDivElement>("i", "far fa-comment");
    const commentNumberContainer = createElement<HTMLSpanElement>(
      "span",
      "comment-number"
    );
    const commentCount = textNode(post.commentNumber);
    commentNumberContainer.appendChild(commentCount);

    comments.addEventListener("click", function () {});

    const retweet = createElement<HTMLDivElement>("div", "retweet");
    const retweetIcon = createElement<HTMLDivElement>("i", "fas fa-retweet");
    const retweetNumberContainer = createElement<HTMLSpanElement>(
      "span",
      "retweet-number"
    );
    const retweetCount = textNode(post.retweetNumber);
    retweetNumberContainer.appendChild(retweetCount);

    let isRetweet = false;
    retweet.addEventListener("click", () => {
      isRetweet = !isRetweet;
      if (isRetweet) {
        retweetIcon.classList.remove("fa");
        retweetIcon.classList.add("fas");
        retweet.style.color = "#17bf63";
        retweetCount.textContent = String(
          parseInt(retweetCount.textContent || "0") + 1
        );
      } else {
        retweetIcon.classList.remove("fas");
        retweetIcon.classList.add("fa");
        retweet.style.color = "#8899a6";
        const newRetweetCount = parseInt(retweetCount.textContent || "0") - 1;
        retweetCount.textContent =
          newRetweetCount >= 0 ? String(newRetweetCount) : "";
      }
    });

    const favorite = createElement<HTMLDivElement>("div", "favorite");
    const favoriteIcon = createElement<HTMLDivElement>("i", "far fa-heart");
    const favoriteNumberContainer = createElement<HTMLSpanElement>(
      "span",
      "favorite-number"
    );
    const favoriteCount = textNode(post.favoriteNumber);
    favoriteNumberContainer.appendChild(favoriteCount);
    let isFavorited = false;

    favorite.addEventListener("click", () => {
      isFavorited = !isFavorited;
      if (isFavorited) {
        favoriteIcon.classList.remove("far");
        favoriteIcon.classList.add("fas");
        favorite.style.color = "red";
        favoriteCount.textContent = String(
          parseInt(favoriteCount.textContent || "0") + 1
        );
      } else {
        favoriteIcon.classList.remove("fas");
        favoriteIcon.classList.add("far");
        favorite.style.color = "#8899a6";
        favoriteCount.textContent = String(
          parseInt(favoriteCount.textContent || "0") - 1
        );
      }
    });

    const externalLink = createElement<HTMLDivElement>("div", "external-link");
    const externalLinkIcon = createElement<HTMLDivElement>(
      "i",
      "bx bx-link-external"
    );
    const externalLinkContainer = createElement<HTMLSpanElement>(
      "span",
      "share"
    );
    const externalLinkText = textNode("Share");
    externalLinkContainer.appendChild(externalLinkText);

    const ShareOptions = document.createElement("div");
    ShareOptions.classList.add("share-options");
    ShareOptions.style.display = "none";
    const copyLinkContainer = createElement<HTMLDivElement>(
      "div",
      "copy-link-container"
    );
    const copyLinkOption = createElement<HTMLDivElement>(
      "div",
      "copy-link-tweet"
    );
    copyLinkOption.textContent = "Copy Tweet Link";
    const copyLinkIcon = createElement<HTMLDivElement>("i", "fa-solid fa-link");
    copyLinkContainer.append(copyLinkOption, copyLinkIcon);

    ShareOptions.appendChild(copyLinkContainer);

    const shareContainer = createElement<HTMLDivElement>(
      "div",
      "share-container"
    );
    const shareTweetOption = createElement<HTMLDivElement>(
      "div",
      "share-tweet"
    );
    const shareTweetIcon = createElement<HTMLDivElement>(
      "i",
      "fa-solid fa-arrow-up-from-bracket"
    );
    shareTweetOption.textContent = "Share Tweet Via...";
    shareContainer.append(shareTweetOption, shareTweetIcon);

    ShareOptions.appendChild(shareContainer);

    externalLink.appendChild(ShareOptions);

    let isShareOptionsVisible = false;

    externalLink.addEventListener("click", () => {
      if (isShareOptionsVisible) {
        ShareOptions.style.display = "none";
        isShareOptionsVisible = false;
      } else {
        ShareOptions.style.display = "block";
        isShareOptionsVisible = true;
      }
    });

    comments.append(commentIcon, commentNumberContainer);
    retweet.append(retweetIcon, retweetNumberContainer);
    favorite.append(favoriteIcon, favoriteNumberContainer);
    externalLink.append(externalLinkIcon, externalLinkContainer);
    contentAction.append(comments, retweet, favorite, externalLink);
    postContent.append(contentAction);
    container.append(userAvatar, postContent, settings);
    return container;
  }

  renderPost = (posts: Post[]) => {
    posts.forEach((post) => postElement.appendChild(this.buildPost(post)));
  };
}
