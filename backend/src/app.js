const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./sessionConfig");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const cookieParser = require("cookie-parser");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

const db = new sqlite3.Database('../database/users.db');

// DBの初期化
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

// フロントエンドのcors
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    console.log(`GET Request: ${req.query}`);
    res.send("SERVER IS RUNNING");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
