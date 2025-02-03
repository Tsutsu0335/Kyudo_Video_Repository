const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./sessionConfig");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const cookieParser = require("cookie-parser");
const sqlite3 = require('sqlite3').verbose();
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

const db = new sqlite3.Database(process.env.DB_PATH);

// DBの初期化
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

// isPublic : true = 1, false = 0
db.run(`CREATE TABLE IF NOT EXISTS videos (
  videoId INTEGER PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  userId TEXT NOT NULL,
  isPublic INTEGER NOT NULL
)`);

// フロントエンドのcors
app.use(cors({
    origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/videos", express.static("../videos"));

app.get("/", (req, res) => {
    console.log(`GET Request: ${req.query}`);
    res.send("SERVER IS RUNNING");
})



app.listen(PORT, () => {
    console.log(`Server is running on http://${process.env.SERVER_HOST}:${PORT}`);
})
