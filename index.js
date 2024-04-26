require("dotenv").config();

const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer");
const upload = require(__dirname + "/modules/upload-images");
const moment = require("moment-timezone");
const fileUpload = require("express-fileupload");

const { toDateString, toDatetimeString } = require(__dirname +
    "/modules/date-tools.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/avatar_img", express.static(__dirname + "/./public/avartar_img"));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 10 * 1000,secure: true }
}));
app.use(cookieParser(process.env.COOKIE_SIGN));

app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.use("/", require(__dirname + "/routes/index"));
app.use("/share", require(__dirname + "/routes/share"));
app.use("/video", require(__dirname + "/routes/video"));
app.use("/join", require(__dirname + "/routes/join"));
app.use("/home", require(__dirname + "/routes/home"));
app.use("/member", require(__dirname + "/routes/member"));
//Sunny
app.use("/admstaff", require(__dirname + "/routes/admstaff"));
app.use("/login", require(__dirname + "/routes/login"));
app.use("/admin", require(__dirname + "/routes/admin"));
app.use("/teacher", require(__dirname + "/routes/teacher"));
app.use("/product", require(__dirname + "/routes/product"));
app.use("/course", require(__dirname + "/routes/course"));
app.use("/book", require(__dirname + "/routes/book"));
app.use("/consult", require(__dirname + "/routes/consult"));
app.use("/discount", require(__dirname + "/routes/discount"));
app.use("/partner", require(__dirname + "/routes/partner"));
app.use("/mou", require(__dirname + "/routes/mou"));
app.use("/qa", require(__dirname + "/routes/qa"));
app.use("/news", require(__dirname + "/routes/news"));

app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>`);
});

app.listen(3700, () => {
    console.log("running in port 3700!");
});
