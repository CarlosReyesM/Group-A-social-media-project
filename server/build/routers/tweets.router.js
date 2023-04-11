"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweetsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const formatDistance_1 = __importDefault(require("date-fns/formatDistance"));
exports.tweetsRouter = express_1.default.Router();
const parsePosts = (posts) => {
    return {
        author: posts.name,
        nametag: posts.name_tag || posts.name,
        time: (0, formatDistance_1.default)(posts.timestamp ? new Date(posts.timestamp) : new Date(), new Date()),
        content: posts.content,
        image: posts.image_address || "",
        commentNumber: posts.comments_count,
        retweetNumber: posts.retweets_count,
        favoriteNumber: posts.favorites_count,
    };
};
exports.tweetsRouter.use((req, res, next) => {
    next();
});
exports.tweetsRouter.get("/:id", (req, res) => {
    const userId = req.params.id;
    const pool = (0, database_1.openDb)();
    pool.query(`
    SELECT 
      t.content, 
      t.timestamp, 
      u.name, 
      u.name_tag, 
      i.address as image_address, 
      (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
      (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
      (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
      FROM tweets t
      LEFT JOIN users u ON user_id = u.id
      LEFT JOIN images i ON t.id = i.tweet_id
      WHERE t.user_id = $1;
  `, [userId], (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
        }
        res.status(200).json(result.rows.map((r) => parsePosts(r)));
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
