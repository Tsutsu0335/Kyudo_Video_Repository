const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");

router.get("/main", isAuthenticated, (req, res) => {
    res.status(200).json({ message: `Welcome to the main page, ${req.session.userId}` });
});

module.exports = router;