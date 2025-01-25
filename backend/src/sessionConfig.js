// Redisとの接続の設定

const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

redisClient.connect().catch(console.error);

const sessionMiddleware = session({
    name: 'userId',
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // httpsに対応するときにtrueに変更
        sameSite: 'lax',
        maxAge: 6 * 60 * 60 * 1000, // 6h
    },
    rolling: true,
});

module.exports = sessionMiddleware;

