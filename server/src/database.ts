import { Pool } from "pg";

export const openDb = (): Pool => {
  const pool: Pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "twitter",
    password: "postgrespw",
    port: 5432,
  });
  return pool;
};