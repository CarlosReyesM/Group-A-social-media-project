export interface Post {
  tweetId: string;
  author: string;
  nametag: string;
  avatar: string;
  time: string;
  content: string;
  image: string;
  favoriteId: number | null;
  commentNumber: string;
  retweetNumber: string;
  favoriteNumber: string;
}