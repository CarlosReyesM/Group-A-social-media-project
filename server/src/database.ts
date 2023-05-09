import { Pool } from "pg";

export const openDb = (): Pool => {
  const pool: Pool = new Pool({
    user: "root",
    host: "dpg-chd7i3l269vdj69mnm0g-a.frankfurt-postgres.render.com",
    database: "twitter__55fz",
    password: "93eM0eFg6fAKEmLwx7ySmUyCUVnvxJfZ",
    port: 5432,
    ssl: true
  });
  return pool;
};