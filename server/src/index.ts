import express, { Express } from "express";
import cors from "cors";
import { tweetsRouter } from "./routers/tweets.router";
import fileUpload from "express-fileupload";
import { commentsRouter } from "./routers/comments.router";
import { likesRouter } from "./routers/likes.router";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload())
app.use(express.static('public'));
app.use("/tweets", tweetsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);

const port = 3001;

app.listen(port);
