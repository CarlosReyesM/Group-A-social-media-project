import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";
import { QueryResult } from "pg";
import { Post, QueryPosts } from "../models/posts";

export const tweetsRouter = express.Router();

const parsePosts = (posts: QueryPosts): Post => {
  return {
    author: posts.name,
    nametag: posts.name_tag || posts.name,
    time: posts.timestamp || new Date().toString(),
    content: posts.content,
    image: posts.image_address || "",
    commentNumber: posts.comments_count,
    retweetNumber: posts.retweets_count,
    favoriteNumber: posts.favorites_count,
  };
};

tweetsRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

tweetsRouter.get("/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const pool = openDb();
  pool.query(
    `
    SELECT 
      t.content, 
      t.timestamp, 
      u.name, 
      u.name_tag, 
      i.address as image_address, 
      (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
      (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
      (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
      FROM tweets t
      LEFT JOIN users u ON user_id = u.id
      LEFT JOIN images i ON t.id = i.tweet_id
      WHERE t.user_id = $1;
  `,
    [userId],
    (error, result: QueryResult<QueryPosts>) => {
      if (error) {
        res.status(500).json({ error: error });
      }
      res.status(200).json(result.rows.map((r) => parsePosts(r)));
    }
  );
});

tweetsRouter.post("/", (req: Request, res: Response) => {
  const pool = openDb();
  const userId = req.body.userId;
  const tweet = req.body.tweet;
  if (!userId || !tweet) {
    res.status(400).json({ error: "bad request" });
    return;
  }
  pool.query(
    "insert into tweets (user_id, content) values ($1, $2) returning *",
    [userId, tweet],
    (error: Error, result: QueryResult) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ id: result.rows[0].id });
      return;
    }
  );
});
