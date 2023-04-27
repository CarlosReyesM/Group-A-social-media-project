import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";

export const likesRouter = express.Router();

likesRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

likesRouter.post("/", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const tweetId = req.body.tweetId;

  console.log(req.body)
  if (!userId || !tweetId) {
    res.status(400).json({ error: "bad request" });
    return;
  }

  const pool = openDb();

  pool.query(
    "SELECT COUNT(*) as count FROM favorites WHERE user_id = $1 AND tweet_id = $2",
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
        "INSERT into favorites (user_id, tweet_id) values ($1, $2) returning id",
        [userId, tweetId],
        (err, response) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(200).json(response.rows[0]);
        }
      );
    }
  );
});

likesRouter.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const pool = openDb();
  pool.query("SELECT FROM favorites WHERE id = $1", [id], (error, response) => {
    if (error) {
      res.status(500).json({ error: error });
      return;
    }
    if (!response.rows.length) {
      res.status(400).json({error: "favorite id not found"})
      return
    }

    pool.query("DELETE FROM favorites WHERE id = $1", [id], (error, _) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json({ id });
    });
  })
});
