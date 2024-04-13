const express = require("express");
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

app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.use((req, res, next) => {
    res.locals.toDateString = toDateString;
    res.locals.toDatetimeString = toDatetimeString;

    const auth = req.get("Authorization");
    res.locals.loginUser = null;
    if (auth && auth.indexOf("Bearer ") === 0) {
        const token = auth.slice(7);
        res.locals.loginUser = jwt.verify(token, process.env.JWT_SECRET);
    }

    next();
});

app.use("/", require(__dirname + "/routes/index"));
// app.use("/cpa", require(__dirname + "/routes/cpa"));
// app.use("/cpe", require(__dirname + "/routes/cpe"));
// app.use("/cma", require(__dirname + "/routes/cma"));
// app.use("/audition", require(__dirname + "/routes/audition"));
app.use("/share", require(__dirname + "/routes/share"));
app.use("/video", require(__dirname + "/routes/video"));
// app.use("/service", require(__dirname + "/routes/service"));
app.use("/home", require(__dirname + "/routes/home"));

app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>`);
});

app.listen(3700, () => {
    console.log("running in port 3700!");
});
