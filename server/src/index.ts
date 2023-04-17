import express, { Express } from "express";
import cors from "cors";
import { tweetsRouter } from "./routers/tweets.router";
import fileUpload from "express-fileupload";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload())
app.use(express.static('public'));
app.use("/tweets", tweetsRouter);

const port = 3001;

app.listen(port);
