// 認証済みかの確認

function isAuthenticated(req, res, next) {
    if (req.session.userId) {  // cookieに有効なuserIdが保存されているか
        return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
}

module.exports = isAuthenticated;