"use strict";
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
exports.likesRouter.delete('/:id', (req, res) => {
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
