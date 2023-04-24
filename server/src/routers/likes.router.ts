import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";

export const likesRouter = express.Router();



likesRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

likesRouter.post("/", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const tweetId = req.body.tweetId;

  if (!userId || !tweetId) {
    res.status(400).json({ error: "bad request" });
    return;
  }

  const pool = openDb();

  pool.query(
    "SELECT COUNT(*) as count FROM likes WHERE user_id = $1 AND tweet_id = $2",
    [userId, tweetId],
    (err, response) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const count = response.rows[0]["count"];
      if (count !== "0") {
        res.status(400).json({ error: "already liked" });
        return;
      }

      pool.query(
        "INSERT into likes (user_id, tweet_id) values ($1, $2) returning id",
        [userId, tweetId],
        (err, _) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(200).json({ id: tweetId });
        }
      );
    }
  );
});
likesRouter.delete("/", (req: Request, res: Response) => {
  const userId = req.body.userId;
  const tweetId = req.body.tweetId;

  const pool = openDb();
  pool.query(
    "DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2",
    [userId, tweetId],
    (error, _) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json({ id: tweetId });
    }
  );
});