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
exports.tweetsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const formatDistance_1 = __importDefault(require("date-fns/formatDistance"));
exports.tweetsRouter = express_1.default.Router();
const parsePosts = (posts) => {
    return {
        author: posts.name,
        nametag: posts.name_tag || posts.name,
        avatar: posts.avatar,
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
      u.avatar,
      i.address as image_address,
      (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
      (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
      (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
      FROM tweets t
      LEFT JOIN users u ON user_id = u.id
      LEFT JOIN images i ON t.id = i.tweet_id
      WHERE t.user_id = $1
      ORDER By t.timestamp DESC;
  `, [userId], (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
            return;
        }
        res.status(200).json(result.rows.map((r) => parsePosts(r)));
    });
});
exports.tweetsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = (0, database_1.openDb)();
    const userId = req.body.userId;
    const tweet = req.body.tweet;
    if (!userId || !tweet) {
        res.status(400).json({ error: "bad request" });
        return;
    }
    const client = yield pool.connect();
    client
        .query("BEGIN")
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield client.query("insert into tweets (user_id, content, timestamp) values ($1, $2, now()) returning id", [userId, tweet]);
        return result;
    }))
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        const newPostRows = yield client.query(`
  SELECT
    t.content,
    t.timestamp,
    u.name,
    u.name_tag,
    u.avatar,
    i.address as image_address,
    (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
    (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
    (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
    FROM tweets t
    LEFT JOIN users u ON user_id = u.id
    LEFT JOIN images i ON t.id = i.tweet_id
    WHERE t.id = $1;
`, [result.rows[0].id]);
        res.status(200).json(newPostRows.rows.map((r) => parsePosts(r)));
        return;
    }))
        .catch((error) => {
        client.query("ROLLBACK");
        res.status(500).json({ error: error.message });
    })
        .finally(() => client.release());
}));
