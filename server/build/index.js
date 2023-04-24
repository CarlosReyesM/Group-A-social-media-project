"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tweets_router_1 = require("./routers/tweets.router");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const comments_router_1 = require("./routers/comments.router");
const likes_router_1 = require("./routers/likes.router");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../public/images')));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_fileupload_1.default)());
app.use("/tweets", tweets_router_1.tweetsRouter);
app.use("/comments", comments_router_1.commentsRouter);
app.use("/likes", likes_router_1.likesRouter);
const port = 3001;
app.listen(port);
