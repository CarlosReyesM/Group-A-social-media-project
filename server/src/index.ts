import express, { Express } from "express";
import cors from "cors";
import { tweetsRouter } from "./routers/tweets.router";
import fileUpload from "express-fileupload";
import { commentsRouter } from "./routers/comments.router";
import { likesRouter } from "./routers/likes.router";
import bodyParser from "body-parser";
import path from "path";

const app: Express = express();
app.use('/images', express.static(path.join(__dirname, '../public/images')))
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload())
app.use("/tweets", tweetsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);

const port = 3001;

app.listen(port);
