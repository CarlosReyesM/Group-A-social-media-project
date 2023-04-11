export interface Post {
  author: string;
  nametag: string;
  time: string;
  content: string;
  image: string;
  commentNumber: string;
  retweetNumber: string;
  favoriteNumber: string;
  imagesPost?: string[];
}

export interface QueryPosts {
  content: string;
  timestamp: string | null;
  name: string;
  name_tag: string |  null;
  image_address: string |  null;
  retweets_count: string;
  comments_count: string;
  favorites_count: string;
}
