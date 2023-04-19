import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";
import { QueryResult } from "pg";
import { CommentQuery } from "../models/comments";
import formatDistance from "date-fns/formatDistance";

export const commentsRouter = express.Router();

commentsRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

const parseComment = (commentRow: CommentQuery) => {
  return {
    id: commentRow.id,
    content: commentRow.content,
    userId: commentRow.userid,
    tweetId: commentRow.tweetid,
    timestamp:  formatDistance(
      commentRow.timestamp ? new Date(commentRow.timestamp) : new Date(),
      new Date()
    ),
    userName: commentRow.name,
    userNameTag: commentRow.nametag,
    userAvatar: commentRow.avatar,
  }
} 

commentsRouter.get("/", (req: Request, res: Response) => {
  const tweetId = req.query.tweetId;
  console.log(tweetId);

  const pool = openDb();
  pool.query(
    `SELECT 
      c.id, 
      c.content,
      c.user_id as userId,
      c.tweet_id as tweetId,
      c.timestamp,
      u.name,
      u.name_tag,
      u.avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE tweet_id = $1`,
    [tweetId],
    (err, response) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(response.rows.map((r) => parseComment(r)));
    }
  );
});

commentsRouter.post("/", async (req: Request, res: Response) => {
  const tweetId = req.body.tweetId;
  const userId = req.body.userId;
  const content = req.body.content;

  const pool = openDb();
  const client = await pool.connect();
  client
    .query("BEGIN")
    .then(async () => {
      const result: QueryResult<{ id: number }> = await client.query(
        "INSERT INTO comments (content, user_id, tweet_id) values ($1, $2, $3) RETURNING id, content",
        [content, userId, tweetId]
      );
      await client.query("COMMIT");
      return result;
    })
    .then(async (result) => {
      const newCommentRows: QueryResult = await client.query(
        `SELECT 
        c.id, 
        c.content,
        c.user_id as userId,
        c.tweet_id as tweetId,
        c.timestamp,
        u.name,
        u.name_tag as nameTag,
        u.avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = $1`,
        [result.rows[0].id]
      );
      res.status(200).json(parseComment(newCommentRows.rows[0]));
      return;
    })
    .catch((error) => {
      client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    })
    .finally(() => client.release());
});

commentsRouter.put("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;
  const content = req.body.content;

  const pool = openDb();
  pool.query(
    "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
    [content, commentId],
    (err, response) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(response.rows);
    }
  );
});

commentsRouter.delete("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;

  const pool = openDb();
  pool.query(
    "DELETE FROM comments WHERE id = $1",
    [commentId],
    (err, response) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(response.rows);
    }
  );
});
