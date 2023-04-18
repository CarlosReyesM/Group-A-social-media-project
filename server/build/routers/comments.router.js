"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
exports.commentsRouter = express_1.default.Router();
exports.commentsRouter.use((req, res, next) => {
    next();
});
exports.commentsRouter.get("/", (req, res) => {
    const tweetId = req.query.tweetId;
    console.log(tweetId);
    const pool = (0, database_1.openDb)();
    pool.query("SELECT id, content, user_id as userId, tweet_id as tweetId from comments WHERE tweet_id = $1", [tweetId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(response.rows);
    });
});
exports.commentsRouter.post("/", (req, res) => {
    const tweetId = req.body.tweetId;
    const userId = req.body.userId;
    const content = req.body.content;
    const pool = (0, database_1.openDb)();
    pool.query("INSERT INTO comments (content, user_id, tweet_id) values ($1, $2, $3) RETURNING id, content", [content, userId, tweetId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(response.rows);
    });
});
exports.commentsRouter.put("/:id", (req, res) => {
    const commentId = req.params.id;
    const content = req.body.content;
    const pool = (0, database_1.openDb)();
    pool.query("UPDATE comments SET content = $1 WHERE id = $2 RETURNING *", [content, commentId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(response.rows);
    });
});
exports.commentsRouter.delete("/:id", (req, res) => {
    const commentId = req.params.id;
    const pool = (0, database_1.openDb)();
    pool.query("DELETE FROM comments WHERE id = $1", [commentId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(response.rows);
    });
});
