// データ取得関連のapi
const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const videosRoutes = require("../api/videos");
require("dotenv").config();

router.use("/videos", videosRoutes);

// ユーザデータの取得
router.get("/user", isAuthenticated, (req, res) => {
    res.status(200).json({ email: req.session.userId });
});

module.exports = router;
