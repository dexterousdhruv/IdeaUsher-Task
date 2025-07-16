import { config } from "dotenv";
import express from "express";
const cors = require("cors");
import morgan from "morgan";
import { connectDB } from "./connect/connect";
import postRouter from "./routes/post.route";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;
config();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

connectDB();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postRouter);

app.listen(PORT, () => {
  console.log(`Yo! Server is running on port ${PORT} `);
});
