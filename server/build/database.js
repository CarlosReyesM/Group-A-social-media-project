"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDb = void 0;
const pg_1 = require("pg");
const openDb = () => {
    const pool = new pg_1.Pool({
        user: "postgres",
        host: "localhost",
        database: "twitter",
        password: "postgrespw",
        port: 5432,
    });
    return pool;
};
exports.openDb = openDb;
