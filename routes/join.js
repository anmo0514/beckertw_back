const express = require("express");
// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
// 設定路由
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodeamiler = require("nodemailer");
const bcrypt = require("bcryptjs");
const randtoken = require("rand-token");
const jwt = require("jsonwebtoken");
const SqlString = require("sqlstring");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

// const sendMail = require(__dirname + "/./config/nodemailer");

const { toDateString, toDatetimeString } = require(__dirname +
    "../../modules/date-tools");

const keys = require(__dirname +
    "/../auth/client_secret_816815070284-20gtk8bv986g0fqpns5uh94i1m2ahp2k.apps.googleusercontent.com.json");

const oAuth2c = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
);

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

//=================nodeamiler
//send email
function sendEmail(email, token) {
    var email = email;
    var token = token;

    var mail = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "shinderr0125@gmail.com",
            pass: "lrkpyajfvjuulwzb",
        },
    });

    var mailOptions = {
        from: "shinderr0125@gmail.com",
        to: email,
        subject: "shuyoung舒營 重設密碼認證信",
        html: `<h1>舒營 重設密碼</h1><p>重設密碼連結：</p><a href="http://localhost:3777/shuyoung/join/resetPassword?token=${token}">點我</a>`,
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("flase");
        } else {
            console.log("success");
        }
    });
}

//================nodemailer

router.post("/login", async (req, res) => {
    console.log(req.body.account);
    const output = {
        success: false,
        error: "",
        code: 0,
        data: {},
    };
    const sql = "SELECT * FROM memberdata WHERE m_username=?";
    const [r1] = await db.query(sql, [req.body.account]);

    if (!r1.length) {
        // 帳號錯誤
        output.code = 401;
        output.error = "查無此帳號，請先申請會員";
        return res.json(output);
    }
    const row = r1[0];

    row.m_birthday = toDateString(row.m_birthday);
    row.create_at = toDateString(row.create_at);

    console.log(row);

    output.success = await bcrypt.compare(req.body.password, r1[0].m_passwd);
    if (!output.success) {
        // 密碼錯誤
        output.code = 402;
        output.error = "帳密錯誤";
    } else {
        // 成功登入
        const token = jwt.sign(
            {
                sid: r1[0].sid,
                account: r1[0].m_username,
            },
            process.env.JWT_SECRET
        );

        output.data = {
            token,
            account: r1[0].m_username,
            sid: r1[0].m_id,
            ...row,
        };
        console.log(output.data);
    }

    res.json(output);
});

router.get("/googleLogin", async (req, res, next) => {
    const googleId = req.query.id;

    const token = req.query.token;

    if (!googleId) {
        res.json({
            success: false,
            code: "400",
            message: "查無googleId",
        });
    } else {
        try {
            const sql = "SELECT * FROM `memberdata` WHERE `m_google_id`=?";

            const [result] = await db.query(sql, [googleId]);

            console.log("查訊結果:", result);

            if (!result.length) {
                res.json({
                    success: false,
                    code: "401",
                    message: "查無使用者資料",
                });
            } else {
                const row = result[0];

                res.json({
                    success: true,
                    code: "200",
                    message: "登入成功",
                    token: token,
                    ...row,
                });
            }
        } catch (err) {
            res.json({
                code: "500",
                error: err,
            });
        }
    }
});

router.post("/register", async (req, res) => {
    const { account, password, email } = req.body;

    //check if data is missing
    if (!account || !password || !email) {
        return res.json({ message: "缺少資料", code: "400" });
    }

    //check if memberdata already exsited
    const checkSql = "SELECT * FROM `memberdata` WHERE m_username =?";
    const [checkResult] = await db.query(checkSql, [account]);

    if (checkResult.length > 0) {
        console.log(checkResult);
        return res.json({ message: "fail", code: "400" });
    } else {
        const hashPw = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO `memberdata`( `m_username`, `m_passwd`, `m_email`,  `create_at`) VALUES (?,?,?,NOW())";
        const [result] = await db.query(sql, [account, hashPw, email]);

        const checkIdSql =
            "SELECT m_id FROM `memberdata` ORDER BY m_id DESC LIMIT 1";
        const [[lastId]] = await db.query(checkIdSql);

        const id = lastId.m_id;

        const couponSql =
            "INSERT INTO `member_coupon`( `m_id`, `coupon_id`, `coupon_status`) VALUES (?,5,0)";
        const [couponResult] = await db.query(couponSql, [id]);

        res.json(result);
    }
});

router.post("/reset-password-email", async (req, res, next) => {
    var email = req.body.emailAddress;

    console.log(email);

    const sql = "SELECT * FROM `memberdata` WHERE m_email =?";

    const [result] = await db.query(sql, [email]);

    if (!result.length) {
        res.json({
            success: false,
            message: "查無此電子郵件",
            code: "400",
        });
    } else {
        var token = randtoken.generate(20);

        var sent = sendEmail(email, token);

        if (sent != "0") {
            var data = {
                hash_code: token,
            };

            const sql2 =
                'UPDATE `memberdata` SET ? WHERE m_email = "' + email + '"';
            [result2] = await db.query(sql2, [data]);

            console.log(result2);

            res.json({
                success: true,
                message: "驗證成功，正在寄送電子郵件...",
                code: "200",
            });
        } else {
            res.json({
                success: false,
                message: "發生錯誤，請再嘗試一遍",
                code: "400",
            });
        }
    }
});

router.get("/api/v1/auth/google", async (req, res, next) => {
    const authorizeUrl = oAuth2c.generateAuthUrl({
        // access_type: "offline",
        // 欲取得 email, 要兩個 scopes
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    });

    return res.json(authorizeUrl);
});

router.get("/api/v1/auth/google/sign", async (req, res, next) => {
    const qs = req.query;

    let myData = {};

    if (qs.code) {
        // 內容參考 /references/from-code-to-tokens.json
        const r = await oAuth2c.getToken(qs.code);
        // console.log(JSON.stringify(r));
        oAuth2c.setCredentials(r.tokens);

        // 連線回應內容參考 /references/tokeninfo-results-oauth2.googleapis.com.json
        // console.log(
        //     `https://oauth2.googleapis.com/tokeninfo?id_token=${r.tokens.id_token}`
        // );

        const url =
            "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos";

        const response = await oAuth2c.request({ url });
        // response 內容參考 /references/people-api-response.json
        myData = response.data;

        const familyName = myData.names[0].familyName; //姓
        const givenName = myData.names[0].givenName; //名
        const userName = myData.names[0].displayName; //名
        const googleId = myData.names[0].metadata.source.id;
        const avatar = myData.photos[0].url;
        const emailAddr = myData.emailAddresses[0].value;

        const checkSql =
            "SELECT * FROM `memberdata` WHERE `m_google_id` =? AND `m_email` = ?";

        const [checkResult] = await db.query(checkSql, [googleId, emailAddr]);

        if (checkResult.length !== 0) {
            console.log("此用戶已經存在");

            const token = jwt.sign(
                {
                    gId: googleId,
                },
                process.env.JWT_SECRET
            );

            res.redirect(
                `http://localhost:3777/shuyoung/member/?token=${token}&id=${googleId}`
            );
        } else {
            const sql =
                "INSERT INTO `memberdata`(`m_last_name`, `m_first_name`, `m_username`, `m_email`,`m_avatar`,  `m_google_id`, `create_at`) VALUES (?,?,?,?,?,?,NOW())";

            const [result] = await db.query(sql, [
                familyName,
                givenName,
                userName,
                emailAddr,
                avatar,
                googleId,
            ]);

            console.log(result);

            const checkIdSql =
                "SELECT m_id FROM `memberdata` ORDER BY m_id DESC LIMIT 1";
            const [[lastId]] = await db.query(checkIdSql);

            const id = lastId.m_id;

            const couponSql =
                "INSERT INTO `member_coupon`( `m_id`, `coupon_id`, `coupon_status`) VALUES (?,5,0)";
            const [couponResult] = await db.query(couponSql, [id]);

            console.log(couponResult);

            const token = jwt.sign(
                {
                    gId: googleId,
                },
                process.env.JWT_SECRET
            );

            res.redirect(
                `http://localhost:3777/shuyoung/member/?token=${token}&id=${googleId}`
            );
        }
    }
});

router.put("/reset-password", async (req, res, next) => {
    const { newPassword, comfirmPassword } = req.body;
    const token = req.query.token;

    if (newPassword !== comfirmPassword) {
        res.json({
            success: false,
            message: "新密碼與確認密碼不符",
            code: "402",
        });
    }

    const newSql = "UPDATE `memberdata` SET  `m_passwd`=? WHERE  `hash_code`=?";

    const hashPw = await bcrypt.hash(newPassword, 10);

    const [newResult] = await db.query(newSql, [hashPw, token]);

    console.log(newResult);

    if (newResult.length !== 0) {
        return res.json({
            success: true,
            message: "修改成功",
            code: "200",
        });
    } else {
        return res.json({
            success: false,
            message: "修改失敗",
            code: "401",
        });
    }
});

// router 一定要回傳module
module.exports = router;
