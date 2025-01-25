const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./sessionConfig");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3001;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/api", authRoutes);

app.get("/", (req, res) => {
    console.log(`GET Request: ${req.query}`);
    res.send("SERVER IS RUNNING");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
