import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";
import { QueryResult } from "pg";
import { Post, QueryPosts } from "../models/posts";
import formatDistance from "date-fns/formatDistance";
import { UploadedFile } from "express-fileupload";
import path from "path";

export const tweetsRouter = express.Router();

const parsePosts = (posts: QueryPosts): Post => {
  return {
    tweetId: posts.id,
    author: posts.name,
    nametag: posts.name_tag || posts.name,
    avatar: posts.avatar,
    time: formatDistance(
      posts.timestamp ? new Date(posts.timestamp) : new Date(),
      new Date()
    ),
    content: posts.content,
    // TODO ADD ENV variables to the path
    image: posts.image_address
      ? `http://localhost:3001${posts.image_address}`
      : "",
    favoriteId: posts.favorite_id,
    commentNumber: posts.comments_count,
    retweetNumber: posts.retweets_count,
    favoriteNumber: posts.favorites_count,
    likeNumber: posts.likes_count,
  };
};

tweetsRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

tweetsRouter.get("/all/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const pool = openDb();
  pool.query(
    `
    SELECT
      t.content,
      t.timestamp,
      t.id,
      u.name,
      u.name_tag,
      u.avatar,
      i.address as image_address,
      f.id as favorite_id,
      (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
      (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
      (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count,
      (SELECT COUNT(*) FROM likes WHERE likes.tweet_id = t.id) AS likes_count
      FROM tweets t
      LEFT JOIN users u ON user_id = u.id
      LEFT JOIN images i ON t.id = i.tweet_id
      LEFT JOIN favorites f ON f.user_id = t.user_id AND f.tweet_id = t.id
      WHERE t.user_id = $1
      ORDER By t.timestamp;
  `,
    [userId],
    (error, result: QueryResult<QueryPosts>) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json(result.rows.map((r) => parsePosts(r)));
    }
  );
});

tweetsRouter.post("/", async (req: Request, res: Response) => {
  const pool = openDb();
  const userId = req.body.userId;
  const tweet = req.body.tweet;
  const file: UploadedFile = req.files?.image as UploadedFile;
  if (!userId || !tweet) {
    res.status(400).json({ error: "bad request" });
    return;
  }
  const client = await pool.connect();
  client
    .query("BEGIN")
    .then(async () => {
      const result: QueryResult<{ id: number }> = await client.query(
        "insert into tweets (user_id, content, timestamp) values ($1, $2, now()) returning id",
        [userId, tweet]
      );
      await client.query("COMMIT");
      return result;
    })
    .then(async (result) => {
      const tweetId = result.rows[0].id;

      if (!file) {
        return tweetId;
      }
      file.mv(path.resolve(`./public/images/${file.name}`), (err) => {
        if (err) {
          console.log(err);
          return new Error(err);
        }
      });

      await client.query(
        "insert into images (address, name, tweet_id, user_id) values ($1, $2, $3, $4)",
        [`/images/${file.name}`, file.name, tweetId, userId]
      );
      await client.query("COMMIT");
      return tweetId;
    })
    .then(async (tweetId) => {
      const newPostRows: QueryResult<QueryPosts> = await client.query(
        `
  SELECT
    t.content,
    t.timestamp,
    t.id,
    u.name,
    u.name_tag,
    u.avatar,
    i.address as image_address,
    f.id as favorite_id,
    (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
    (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
    (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
    FROM tweets t
    LEFT JOIN users u ON user_id = u.id
    LEFT JOIN images i ON t.id = i.tweet_id
    LEFT JOIN favorites f ON f.user_id = t.user_id AND f.tweet_id = t.id
    WHERE t.id = $1;
`,
        [tweetId]
      );
      res.status(200).json(newPostRows.rows.map((r) => parsePosts(r)));
      return;
    })
    .catch((error) => {
      client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    })
    .finally(() => client.release());
});

tweetsRouter.delete("/:id", (req: Request, res: Response) => {
  const tweetId = req.params.id;
  const pool = openDb();
  pool.query(
    "DELETE FROM tweets WHERE id = $1",
    [tweetId],
    (error, result: QueryResult<QueryPosts>) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json({ id: tweetId });
    }
  );
});

tweetsRouter.put("/:id", (req: Request, res: Response) => {
  const tweetId = req.params.id;
  const content = req.body.tweet;
  const pool = openDb();
  pool.query(
    "UPDATE tweets SET content = $1 WHERE id = $2 returning *",
    [content, tweetId],
    (error, result: QueryResult<QueryPosts>) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(result.rows[0]);
    }
  );
});
