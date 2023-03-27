"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = 3001;
app.get("/", (req, res) => {
    const pool = openDb();
    pool.query("select * from tweets", (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
        }
        res.status(200).json(result.rows);
    });
});
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
app.listen(port);
