// 認証関連

const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
require("dotenv").config();

const db = new sqlite3.Database(process.env.DB_PATH);

// 登録
router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    console.log("try to signup: ", email);

    // 入力されたデータのチェック //

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: `登録に失敗しました。${err}` });
        }

        // セッションの再生成
        req.session.regenerate((err) => {
            if (err) {
                console.log("failed to signup: ", email);
                return res.status(500).json({ message: 'セッションの生成に失敗しました。' });
            }

            req.session.userId = email; // cookieの保存
            res.status(201).json({ message: 'ユーザー登録完了！' });
            console.log("signup: ", email);
        });
    });
});

// ログイン
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("try to login: ", email);

    // エラーの種類による応答時間の差をなくす //

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        //// 開発中のためエラーを分割 ////
        if (err || !user) {
            console.log("failed to login: ", email);
            return res.status(400).json({ message: 'ユーザーが見つかりません。' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            console.log("failed to login: ", email);
            return res.status(400).json({ message: 'パスワードが間違っています。' });
        }
        //// 開発中のためエラーを分割 ////

        // セッションの再生成
        req.session.regenerate((err) => {
            if (err) {
                console.log("failed to login: ", email);
                return res.status(500).json({ message: 'セッションの生成に失敗しました。' });
            }

            req.session.userId = email; // cookieの保存
            res.status(200).json({ message: 'ログイン成功！' });
            console.log("login: ", email);
        });

    });
});

// ログアウト
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'ログアウト失敗' });
        }

        res.clearCookie('userId'); // cookieの削除
        res.status(200).json({ message: 'ログアウト成功' });
    });
});

// 認証済みかの確認
router.get("/check", isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'authenticated' });
});

module.exports = router;
