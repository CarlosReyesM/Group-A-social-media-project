import { MAIN_URL } from "../constants.js";
import { createElement, textNode } from "../helpers/documentHelper.js";
import { Post, Comment } from "../interfaces/post.js";
const postElement = <HTMLElement>document.querySelector(".posts");

export default class Posts {
  constructor() {}

  posts: Post[] = [];
  comments: Comment[] = [];
  deletedPostID: number | null = null;
  editedPostID: number | null = null;

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

  async fetchComments(tweetId: string) {
    // TODO get user id from JWT
    const userId = 1;
    try {
      const comments: Comment[] = await fetch(
        `${MAIN_URL}/comments/?tweetId=${tweetId}`
      ).then((result) => result.json());
      this.comments = comments;
      this.renderComments(comments);
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

  async giveFavorite(tweetId: number): Promise<{ id: number }> {
    const body = {
      userId: 1,
      tweetId,
    };
    const likeId = await fetch(`${MAIN_URL}/likes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => {
        console.error(error);
      });
    return likeId;
  }

  async deleteFavorite(tweetId: string): Promise<{ id: number }> {
    const deletedLikeId = await fetch(`${MAIN_URL}/likes/${tweetId}`, {
      method: "delete",
    })
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => {
        console.error(error);
      });
    return deletedLikeId;
  }

  buildComment(comment: Comment) {
    const commentsContainer = <HTMLInputElement>(
      document.getElementById(`comments-${comment.tweetId}`)
    );

    const commentPost = createElement<HTMLDivElement>(
      "div",
      "comment-post",
      `comment-${comment.id}`
    );

    // avatar
    const userAvatar = createElement<HTMLDivElement>("div", "user-avatar");
    userAvatar.className = "user-avatar";
    const avatarImage = createElement<HTMLImageElement>("img");
    avatarImage.src = comment.userAvatar || "images/user1.jpg";
    userAvatar.appendChild(avatarImage);

    // post
    const postContent = createElement<HTMLDivElement>("div", "post-content");
    const postUserInfo = createElement<HTMLDivElement>(
      "div",
      "post-user-info light-text"
    );
    const author = createElement<HTMLHeadingElement>("h4");
    const authorName = textNode(comment.userName);
    author.appendChild(authorName);
    const nameTag = createElement<HTMLSpanElement>("span");
    const tagAndTimeText = textNode(`. ${comment.timestamp}`);
    nameTag.appendChild(tagAndTimeText);
    postUserInfo.append(author, nameTag);

    // content
    const postText = createElement<HTMLParagraphElement>(
      "p",
      "post-text light-text"
    );
    const postTextContent = textNode(comment.content);
    postText.appendChild(postTextContent);
    postContent.append(postUserInfo, postText);

    commentPost.append(userAvatar, postContent);

    commentsContainer.append(commentPost);
  }

  buildPost(post: Post) {
    const container = createElement<HTMLDivElement>("div", "post border");
    container.dataset.id = post.tweetId;
    const postContainer = createElement<HTMLDivElement>(
      "div",
      "post-container"
    );

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
    editContainer.dataset.id = post.tweetId;
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
      modalWrapper.classList.add("modal-wrapper-display");
      modalPost.style.display = "block";
      inputPost.placeholder = post.content;
      this.editedPostID = parseInt(post.tweetId);
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
      this.deletedPostID = parseInt(post.tweetId);
      console.log(this.deletedPostID);
    });

    const cancelBtn = <HTMLElement>document.querySelector(".cancelBtn");
    cancelBtn.addEventListener("click", () => {
      deleteNotificationModal.style.display = "none";
      deleteWrapper.style.display = "none";
      this.deletedPostID = null;
    });

    const deleteBtn = <HTMLElement>document.querySelector(".deletebtn");
    deleteBtn.addEventListener("click", () => {
      deleteNotificationModal.style.display = "none";
      deleteWrapper.style.display = "none";
      this.deletedPostID = null;
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

    let showComment = false;

    // comment
    let commentsContainer: HTMLDivElement | null = null;
    comments.addEventListener("click", async () => {
      if (post.commentNumber !== "0") {
        if (!showComment) {
          commentsContainer = createElement<HTMLDivElement>(
            "div",
            "comments",
            `comments-${post.tweetId}`
          );
          container.append(commentsContainer);
          await this.fetchComments(post.tweetId);
        } else {
          commentsContainer?.remove();
        }
        showComment = !showComment;
      }
    });
    

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
    if (post.favoriteId) {
      favoriteIcon.dataset.favoriteId = String(post.favoriteId);
      favoriteIcon.classList.remove("far");
      favoriteIcon.classList.add("fas");
      favorite.style.color = "red";
    }

    favorite.addEventListener("click", async () => {
      if (!favoriteIcon.dataset.favoriteId) {
        const favoriteId = await this.giveFavorite(parseInt(post.tweetId, 10));
        if (favoriteId.id) {
          const postIndex = this.posts.findIndex(
            (p) => p.tweetId === post.tweetId
          );
          this.posts[postIndex].favoriteId = favoriteId.id;
          this.posts[postIndex].favoriteNumber = String(
            parseInt(this.posts[postIndex].favoriteNumber, 10) + 1
          );
          favoriteIcon.dataset.favoriteId = String(favoriteId.id);
          favoriteIcon.classList.remove("far");
          favoriteIcon.classList.add("fas");
          favorite.style.color = "red";
          favoriteCount.textContent = this.posts[postIndex].favoriteNumber;
        }
      } else {
        const deletedFavorite = await this.deleteFavorite(
          favoriteIcon.dataset.favoriteId
        );
        if (deletedFavorite.id) {
          const postIndex = this.posts.findIndex(
            (p) => p.tweetId === post.tweetId
          );
          this.posts[postIndex].favoriteId = null;
          this.posts[postIndex].favoriteNumber = String(
            parseInt(this.posts[postIndex].favoriteNumber, 10) - 1
          );
          delete favoriteIcon.dataset.favoriteId;
          favoriteIcon.classList.remove("fas");
          favoriteIcon.classList.add("far");
          favorite.style.color = "#8899a6";
          favoriteCount.textContent = this.posts[postIndex].favoriteNumber;
        }
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
    postContainer.append(userAvatar, postContent, settings);
    container.append(postContainer);
    return container;
  }

  renderPost = (posts: Post[]) => {
    posts.forEach((post) => postElement.appendChild(this.buildPost(post)));
  };

  renderComments = (comments: Comment[]) => {
    comments.forEach((comment) => this.buildComment(comment));
  };
}
