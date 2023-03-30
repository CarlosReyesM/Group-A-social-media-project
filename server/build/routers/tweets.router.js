"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweetsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
exports.tweetsRouter = express_1.default.Router();
exports.tweetsRouter.use((req, res, next) => {
    next();
});
exports.tweetsRouter.get("/", (req, res) => {
    const pool = (0, database_1.openDb)();
    pool.query("select * from tweets", (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
        }
        res.status(200).json(result.rows);
    });
});
exports.tweetsRouter.post("/", (req, res) => {
    const pool = (0, database_1.openDb)();
    const userId = req.body.userId;
    const tweet = req.body.tweet;
    if (!userId || !tweet) {
        res.status(400).json({ error: "bad request" });
        return;
    }
    pool.query("insert into tweets (user_id, content) values ($1, $2) returning *", [userId, tweet], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ id: result.rows[0].id });
        return;
    });
});
