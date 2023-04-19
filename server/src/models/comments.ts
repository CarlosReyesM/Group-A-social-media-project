export interface CommentQuery {
  id: number;
  content: string;
  userid: number;
  tweetid: number;
  timestamp: string;
  name: string;
  nametag: string;
  avatar: string | null;
}
