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
exports.likesRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
exports.likesRouter = express_1.default.Router();
exports.likesRouter.use((req, res, next) => {
    next();
});
exports.likesRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const tweetId = req.body.tweetId;
    console.log(req.body);
    if (!userId || !tweetId) {
        res.status(400).json({ error: "bad request" });
        return;
    }
    const pool = (0, database_1.openDb)();
    pool.query("SELECT COUNT(*) as count FROM favorites WHERE user_id = $1 AND tweet_id = $2", [userId, tweetId], (err, response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const count = response.rows[0]["count"];
        if (count !== "0") {
            res.status(400).json({ error: "already liked" });
            return;
        }
        pool.query("INSERT into favorites (user_id, tweet_id) values ($1, $2) returning id", [userId, tweetId], (err, response) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json(response.rows[0]);
        });
    });
}));
exports.likesRouter.delete("/:id", (req, res) => {
    const id = req.params.id;
    const pool = (0, database_1.openDb)();
    pool.query("SELECT FROM favorites WHERE id = $1", [id], (error, response) => {
        if (error) {
            res.status(500).json({ error: error });
            return;
        }
        if (!response.rows.length) {
            res.status(400).json({ error: "favorite id not found" });
            return;
        }
        pool.query("DELETE FROM favorites WHERE id = $1", [id], (error, _) => {
            if (error) {
                res.status(500).json({ error: error });
                return;
            }
            res.status(200).json({ id });
        });
    });
});
