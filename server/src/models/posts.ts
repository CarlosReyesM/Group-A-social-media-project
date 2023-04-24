export interface Post {
  tweetId: string;
  author: string;
  nametag: string;
  time: string;
  content: string;
  avatar: string;
  image: string;
  commentNumber: string;
  retweetNumber: string;
  favoriteNumber: string;
  likeNumber: string;
}

export interface QueryPosts {
  content: string;
  timestamp: string | null;
  id: string;
  name: string;
  name_tag: string |  null;
  avatar: string;
  image_address: string |  null;
  retweets_count: string;
  comments_count: string;
  favorites_count: string;
  likes_count: string;

}
