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
      const posts: Post[] = await fetch(`${MAIN_URL}/tweets/${userId}`).then(
        (result) => result.json()
      );
      this.posts = posts;
      this.renderPost(posts);
    } catch (error) {
      console.error(error);
    }
  }

  async createPost(content: string) {
    // TODO get user id from JWT
    const userId = 1;
    const body = {
      userId: userId,
      tweet: content,
    };
    try {
      await fetch(`${MAIN_URL}/tweets`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      })
        .then((result) => result.json())
        .then((post) => this.renderPost(post));
    } catch (error) {
      console.error(error);
      return [];
    }
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

    const retweet = createElement<HTMLDivElement>("div", "retweet");
    const retweetIcon = createElement<HTMLDivElement>("i", "fas fa-retweet");
    const retweetNumberContainer = createElement<HTMLSpanElement>(
      "span",
      "retweet-number"
    );
    const retweetCount = textNode(post.retweetNumber);
    retweetNumberContainer.appendChild(retweetCount);

    const favorite = createElement<HTMLDivElement>("div", "favorite");
    const favoriteIcon = createElement<HTMLDivElement>("i", "far fa-heart");
    const favoriteNumberContainer = createElement<HTMLSpanElement>(
      "span",
      "favorite-number"
    );
    const favoriteCount = textNode(post.favoriteNumber);
    favoriteNumberContainer.appendChild(favoriteCount);

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

    comments.append(commentIcon, commentNumberContainer);
    retweet.append(retweetIcon, retweetNumberContainer);
    favorite.append(favoriteIcon, favoriteNumberContainer);
    externalLink.append(externalLinkIcon, externalLinkContainer);

    contentAction.append(comments, retweet, favorite, externalLink);
    postContent.append(contentAction);
    container.append(userAvatar, postContent);
    return container;
  }

  renderPost = (posts: Post[]) => {
    posts.forEach((post) => postElement.appendChild(this.buildPost(post)));
  };
}