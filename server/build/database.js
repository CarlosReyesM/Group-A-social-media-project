"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDb = void 0;
const pg_1 = require("pg");
const openDb = () => {
    const pool = new pg_1.Pool({
        user: "root",
        host: "dpg-chd7i3l269vdj69mnm0g-a.frankfurt-postgres.render.com",
        database: "twitter__55fz",
        password: "93eM0eFg6fAKEmLwx7ySmUyCUVnvxJfZ",
        port: 5432,
        ssl: true
    });
    return pool;
};
exports.openDb = openDb;
