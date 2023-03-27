import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3001;

app.get("/", (req: Request, res: Response) => {
  const pool = openDb();
  pool.query("select * from tweets", (error, result) => {
    if (error) {
      res.status(500).json({ error: error });
    }
    res.status(200).json(result.rows);
  });
});

const openDb = (): Pool => {
  const pool: Pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "twitter",
    password: "postgrespw",
    port: 5432,
  });
  return pool;
};

app.listen(port);
