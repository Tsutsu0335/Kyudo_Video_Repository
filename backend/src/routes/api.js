// データ取得関連のapi
const express = require('express');
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../middlewares/authMiddleware");
const videosRoutes = require("../api/videos");
require("dotenv").config();

router.use("/videos", isAuthenticated, videosRoutes);
router.use("/mediapipe/pose", express.static(path.join(__dirname, "../../public/@mediapipe/pose")));

// ユーザデータの取得
router.get("/user", isAuthenticated, (req, res) => {
    res.status(200).json({ email: req.session.userId });
});

module.exports = router;
