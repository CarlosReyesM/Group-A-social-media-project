import express, { Request, Response, NextFunction } from "express";
import { openDb } from "../database";
import { QueryResult } from "pg";

export const tweetsRouter = express.Router();

tweetsRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

tweetsRouter.get("/", (req: Request, res: Response) => {
  const pool = openDb();
  pool.query("select * from tweets", (error, result) => {
    if (error) {
      res.status(500).json({ error: error });
    }
    res.status(200).json(result.rows);
  });
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
