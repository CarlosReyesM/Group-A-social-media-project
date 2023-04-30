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
const path_1 = __importDefault(require("path"));
exports.tweetsRouter = express_1.default.Router();
const parsePosts = (posts) => {
    return {
        tweetId: posts.id,
        author: posts.name,
        nametag: posts.name_tag || posts.name,
        avatar: posts.avatar,
        time: (0, formatDistance_1.default)(posts.timestamp ? new Date(posts.timestamp) : new Date(), new Date()),
        content: posts.content,
        // TODO ADD ENV variables to the path
        image: posts.image_address
            ? `http://localhost:3001${posts.image_address}`
            : "",
        favoriteId: posts.favorite_id,
        commentNumber: posts.comments_count,
        retweetNumber: posts.retweets_count,
        favoriteNumber: posts.favorites_count,
        likeNumber: posts.likes_count,
    };
};
exports.tweetsRouter.use((req, res, next) => {
    next();
});
exports.tweetsRouter.get("/all/:id", (req, res) => {
    const userId = req.params.id;
    const pool = (0, database_1.openDb)();
    pool.query(`
    SELECT
      t.content,
      t.timestamp,
      t.id,
      u.name,
      u.name_tag,
      u.avatar,
      i.address as image_address,
      f.id as favorite_id,
      (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
      (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
      (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count,
      (SELECT COUNT(*) FROM likes WHERE likes.tweet_id = t.id) AS likes_count
      FROM tweets t
      LEFT JOIN users u ON user_id = u.id
      LEFT JOIN images i ON t.id = i.tweet_id
      LEFT JOIN favorites f ON f.user_id = t.user_id AND f.tweet_id = t.id
      WHERE t.user_id = $1
      ORDER By t.timestamp;
  `, [userId], (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
            return;
        }
        res.status(200).json(result.rows.map((r) => parsePosts(r)));
    });
});
exports.tweetsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pool = (0, database_1.openDb)();
    const userId = req.body.userId;
    const tweet = req.body.tweet;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    if (!userId || !tweet) {
        res.status(400).json({ error: "bad request" });
        return;
    }
    const client = yield pool.connect();
    client
        .query("BEGIN")
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield client.query("insert into tweets (user_id, content, timestamp) values ($1, $2, now()) returning id", [userId, tweet]);
        yield client.query("COMMIT");
        return result;
    }))
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        const tweetId = result.rows[0].id;
        if (!file) {
            return tweetId;
        }
        file.mv(path_1.default.resolve(`./public/images/${file.name}`), (err) => {
            if (err) {
                console.log(err);
                return new Error(err);
            }
        });
        yield client.query("insert into images (address, name, tweet_id, user_id) values ($1, $2, $3, $4)", [`/images/${file.name}`, file.name, tweetId, userId]);
        yield client.query("COMMIT");
        return tweetId;
    }))
        .then((tweetId) => __awaiter(void 0, void 0, void 0, function* () {
        const newPostRows = yield client.query(`
  SELECT
    t.content,
    t.timestamp,
    t.id,
    u.name,
    u.name_tag,
    u.avatar,
    i.address as image_address,
    f.id as favorite_id,
    (SELECT COUNT(*) FROM retweets WHERE retweets.tweet_id = t.id) AS retweets_count,
    (SELECT COUNT(*) FROM comments WHERE comments.tweet_id = t.id) AS comments_count,
    (SELECT COUNT(*) FROM favorites WHERE favorites.tweet_id = t.id) AS favorites_count
    FROM tweets t
    LEFT JOIN users u ON user_id = u.id
    LEFT JOIN images i ON t.id = i.tweet_id
    LEFT JOIN favorites f ON f.user_id = t.user_id AND f.tweet_id = t.id
    WHERE t.id = $1;
`, [tweetId]);
        res.status(200).json(newPostRows.rows.map((r) => parsePosts(r)));
        return;
    }))
        .catch((error) => {
        client.query("ROLLBACK");
        res.status(500).json({ error: error.message });
    })
        .finally(() => client.release());
}));
exports.tweetsRouter.delete("/:id", (req, res) => {
    const tweetId = req.params.id;
    const pool = (0, database_1.openDb)();
    pool.query("DELETE FROM tweets WHERE id = $1", [tweetId], (error, result) => {
        if (error) {
            res.status(500).json({ error: error });
            return;
        }
        res.status(200).json({ id: tweetId });
    });
});
exports.tweetsRouter.put("/:id", (req, res) => {
    const tweetId = req.params.id;
    const content = req.body.tweet;
    const pool = (0, database_1.openDb)();
    pool.query("UPDATE tweets SET content = $1 WHERE id = $2 returning *", [content, tweetId], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(result.rows[0]);
    });
});
