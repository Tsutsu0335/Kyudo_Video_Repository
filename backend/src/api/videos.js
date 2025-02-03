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

const uploadDir = path.join(__dirname, '../../public/videos/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// content-typeでのフィルターを実装したい // 
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });

// 自分のwebmの情報取得
router.get("/myvideos", isAuthenticated, (req, res) => {
    const query = "SELECT videoId AS id, filename, title, userId, isPublic FROM videos WHERE userId = ?";
    db.all(query, [req.session.userId], (err, rows) => {
        if (err) {
            console.log('db error:', err.message);
            return res.status(500).json({ error: 'DB ERROR' });
        }
        res.status(200).json(rows);
    });
});

// webmへのアクセス
router.get('/:filename', isAuthenticated, (req, res) => {
    // videoid検索に変えたい
    const query = "SELECT userId, isPublic FROM videos WHERE filename = ?";
    db.get(query, [req.params.filename], (err, row) => {
        if (err) {
            console.log('db error:', err.message);
            return res.status(500).json({ error: 'DB ERROR' });
        }

        // 閲覧権限があるかどうか
        if (row.userId !== req.session.userId && row.isPublic === 0) {
            return res.status(403).json({ error: 'ERROR' });
        }

        const filepath = path.join(uploadDir, req.params.filename);
        res.sendFile(filepath);
    })
});

router.post('/setvisibility', isAuthenticated, (req, res) => {
    const query = "SELECT userId FROM videos WHERE videoId = ?";
    db.serialize(() => {
        db.get(query, [req.body.videoId], (err, row) => {
            if (err) {
                console.log('db error:', err.message);
                return res.status(500).json({ error: 'DB ERROR' });
            }

            // 編集権限があるかどうか
            if (row.userId !== req.session.userId) {
                return res.status(403).json({ error: 'ERROR' });
            }
        });

        db.run("UPDATE videos SET isPublic = ? WHERE videoId = ?", [req.body.isPublic, req.body.videoId], (err) => {
            if (err) {
                console.log('db error:', err.message);
                return res.status(500).json({ error: 'DB ERROR' });
            }

            res.status(200).json({ result: req.body.isPublic, message: "toggled" });
        });
    });
    
});

// webmのアップロード
router.post('/upload', isAuthenticated, upload.single('video'), (req, res) => {
    if (!req.file) {
        res.status(200).json({ message: 'video data is not found' });
    }

    const filename = req.file.originalname;
    const title = req.body.title;
    const userId = req.session.userId;
    const isPublicFlag = req.body.isPublic === 'true' ? 1 : 0;

    db.run(
        'INSERT INTO videos (filename, title, userId, isPublic) VALUES (?, ?, ?, ?)',
        [filename, title, userId, isPublicFlag],
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
