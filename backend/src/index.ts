import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose, { mongo } from "mongoose";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log(`serving runing on http://localhost:8080`);
});

const MONGO_URL =
  "mongodb+srv://oonelsoncodes:MJoxsxtSmlGs8LJs@notes-app.jvi1tl5.mongodb.net/?retryWrites=true&w=majority&appName=notes-app";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on(`error`, (error, Error) => console.log);
