"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const formatDistance_1 = __importDefault(require("date-fns/formatDistance"));
exports.commentsRouter = express_1.default.Router();
exports.commentsRouter.use((req, res, next) => {
    next();
});
const parseComment = (commentRow) => {
    return {
        id: commentRow.id,
        content: commentRow.content,
        userId: commentRow.userid,
        tweetId: commentRow.tweetid,
        timestamp: (0, formatDistance_1.default)(commentRow.timestamp ? new Date(commentRow.timestamp) : new Date(), new Date()),
        userName: commentRow.name,
        userNameTag: commentRow.nametag,
        userAvatar: commentRow.avatar,
    };
};
exports.commentsRouter.get("/", (req, res) => {
    const tweetId = req.query.tweetId;
    console.log(tweetId);
    const pool = (0, database_1.openDb)();
    pool.query(`SELECT 
      c.id, 
      c.content,
      c.user_id as userId,
      c.tweet_id as tweetId,
      c.timestamp,
      u.name,
      u.name_tag,
      u.avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE tweet_id = $1`, [tweetId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(response.rows.map((r) => parseComment(r)));
    });
});
exports.commentsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweetId = req.body.tweetId;
    const userId = req.body.userId;
    const content = req.body.content;
    const pool = (0, database_1.openDb)();
    const client = yield pool.connect();
    client
        .query("BEGIN")
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield client.query("INSERT INTO comments (content, user_id, tweet_id) values ($1, $2, $3) RETURNING id, content", [content, userId, tweetId]);
        yield client.query("COMMIT");
        return result;
    }))
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        const newCommentRows = yield client.query(`SELECT 
        c.id, 
        c.content,
        c.user_id as userId,
        c.tweet_id as tweetId,
        c.timestamp,
        u.name,
        u.name_tag as nameTag,
        u.avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = $1`, [result.rows[0].id]);
        res.status(200).json(parseComment(newCommentRows.rows[0]));
        return;
    }))
        .catch((error) => {
        client.query("ROLLBACK");
        res.status(500).json({ error: error.message });
    })
        .finally(() => client.release());
}));
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
