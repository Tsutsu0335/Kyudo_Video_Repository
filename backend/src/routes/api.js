// データ取得関連のapi

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const db = new sqlite3.Database(process.env.DB_PATH);

const uploadDir = path.join(__dirname, '../../videos/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// content-typeでのフィルターを実装したい // 
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.originalname}${ext}`);
    },
});
const upload = multer({ storage });

// ユーザデータの取得
router.get("/user", isAuthenticated, (req, res) => {
    res.status(200).json({ email: req.session.userId });
});

router.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        res.status(200).json({ message: 'video data is not found' });    
    }

    const filename = req.file.originalname;
    const userId = req.session.userId;
    const isPublicFlag = req.body.isPublic === 'true' ? 1 : 0;

    db.run(
        'INSERT INTO videos (filename, userId, isPublic) VALUES (?, ?, ?)',
        [filename, userId, isPublicFlag],
        function (err) {
            if (err) {
                console.error('データベース保存エラー:', err.message);
                res.status(500).json({ error: 'データベースへの保存に失敗しました' });
                return;
            }
            res.status(200).json({ message: '動画がアップロードされました', videoId: this.lastID });
        }
    );
});


module.exports = router;
