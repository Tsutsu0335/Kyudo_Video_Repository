// データ取得関連のapi

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");

const db = new sqlite3.Database('../database/users.db');

// ユーザデータの取得
router.get("/user", isAuthenticated, (req, res) => {
    res.status(200).json({ email: req.session.userId });
});


module.exports = router;
