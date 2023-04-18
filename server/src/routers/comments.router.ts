import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";
import { QueryResult } from "pg";

export const commentsRouter = express.Router();

commentsRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

commentsRouter.get("/", (req: Request, res: Response) => {
  const tweetId = req.query.tweetId;
  console.log(tweetId);

  const pool = openDb();
  pool.query("SELECT id, content, user_id as userId, tweet_id as tweetId from comments WHERE tweet_id = $1", [tweetId], (err, response) => {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.status(200).json(response.rows)
  })
})

commentsRouter.post("/", (req: Request, res: Response) => {
  const tweetId = req.body.tweetId;
  const userId = req.body.userId;
  const content = req.body.content;

  const pool = openDb();
  pool.query("INSERT INTO comments (content, user_id, tweet_id) values ($1, $2, $3) RETURNING id, content", [content, userId, tweetId], (err, response) => {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.status(200).json(response.rows)
  })
})

commentsRouter.put("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;
  const content = req.body.content;

  const pool = openDb();
  pool.query("UPDATE comments SET content = $1 WHERE id = $2 RETURNING *", [content, commentId], (err, response) => {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.status(200).json(response.rows)
  })
})


commentsRouter.delete("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;

  const pool = openDb();
  pool.query("DELETE FROM comments WHERE id = $1", [commentId], (err, response) => {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.status(200).json(response.rows)
  })
})