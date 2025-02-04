// 映像関連のapi
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
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
router.get("/myvideos", (req, res) => {
    const query = "SELECT videoId AS id, title, userId, isPublic FROM videos WHERE userId = ?";
    db.all(query, [req.session.userId], (err, rows) => {
        if (err) {
            console.log('db error:', err.message);
            return res.status(500).json({ error: 'DB ERROR' });
        }
        res.status(200).json(rows);
    });
});

router.get("/publicvideos", (req, res) => {
    const query = "SELECT videoId AS id, title, userId FROM videos WHERE isPublic = 1";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log('db error:', err.message);
            return res.status(500).json({ error: 'DB ERROR' });
        }
        res.status(200).json(rows);
    });
});

// webmへのアクセス
router.get('/:id', (req, res) => {
    const query = "SELECT userId, filename, isPublic FROM videos WHERE videoId = ?";
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.log('db error:', err.message);
            return res.status(500).json({ error: 'DB ERROR' });
        }

        // 閲覧権限があるかどうか
        if (row.userId !== req.session.userId && row.isPublic === 0) {
            return res.status(403).json({ error: 'ERROR' });
        }

        const filepath = path.join(uploadDir, row.filename);
        res.sendFile(filepath);
    })
});

// タイトルチェックを実装できていない
router.post('/edittitle', (req, res) => {
    const query = "SELECT userId FROM videos WHERE videoId = ?";
    let filename;
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

            filename = row.filename;
        });

        db.run("UPDATE videos SET title = ? WHERE videoId = ?", [req.body.newTitle, req.body.videoId], (err) => {
            if (err) {
                console.log('db error:', err.message);
                return res.status(500).json({ error: 'DB ERROR' });
            }

            res.status(200).json({ message: "deleted" });
        });
    });
});

router.post('/delete', (req, res) => {
    const query = "SELECT userId, filename FROM videos WHERE videoId = ?";
    let filename;
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

            filename = row.filename;
        });

        db.run("DELETE FROM videos WHERE videoId = ?", [req.body.videoId], (err) => {
            if (err) {
                console.log('db error:', err.message);
                return res.status(500).json({ error: 'DB ERROR' });
            }

            try {
                fs.unlinkSync(path.join(uploadDir, filename));
            } catch (err) {
                console.err(err);
            }
            res.status(200).json({ message: "deleted" });
        });
    });
});

router.post('/setvisibility', (req, res) => {
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
router.post('/upload', upload.single('video'), (req, res) => {
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
