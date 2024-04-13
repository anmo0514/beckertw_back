const express = require("express");
// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = require(__dirname + "/../modules/upload-images");
const jwt = require("jsonwebtoken");
const SqlString = require("sqlstring");
const { toDateString, toDatetimeString } = require(__dirname +
    "../../modules/date-tools");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.use("/avatar_img", express.static(__dirname + "/../public/avartar_img"));

// router.put("/try-upload", upload.single("avatar"), async (req, res) => {
//     const url = req.body.avatar;
//     const sid = req.body.sid;

//     console.log(req.body);

//     const sql = "UPDATE `memberdata` SET`m_avatar`=? WHERE `m_id`=?";

//     const [result] = await db.query(sql, [url, sid]);

//     if (result.affectedRows !== 0) {
//         res.json({ url: url, success: true });
//     } else {
//         res.json("file uploaded failed");
//     }

//     // res.json(req.file);
// });

router.post("/upload-avatar/:userId", async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.json({ message: "didn't get userId", code: "400" });
    }

    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded",
            });
        } else {
            //使用輸入框的名稱來獲取上傳檔案 (例如 "avatar")
            let avatar = req.files.avatar;

            //使用 mv() 方法來移動上傳檔案到要放置的目錄裡 (例如 "uploads")
            avatar.mv("./public/avatar_img/" + avatar.name);

            const url = `http://localhost:3700/avatar_img/${avatar.name}`;

            const sql = "UPDATE `memberdata` SET`m_avatar`=? WHERE `m_id`=?";

            const [result] = await db.query(sql, [url, userId]);

            console.log(result);

            //送出回應
            res.json({
                status: true,
                message: "File is uploaded",
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size,
                },
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/creditcard", async (req, res, next) => {
    const { memberId } = req.query;

    console.log(memberId);

    if (!memberId) {
        res.json({
            success: false,
            code: "401",
            message: "no memberID",
        });
    }

    const sql = "SELECT * FROM `credit_card` WHERE m_id = ?";

    const [result] = await db.query(sql, [memberId]);

    for (let i = 0; i < result.length; i++) {
        result[i].card_number = result[i].card_number.split(" ");
    }

    console.log("creditcard", result);

    if (!result.length) {
        res.json({
            success: false,
            code: "402",
            message: "no data",
        });
    } else {
        res.json({
            success: true,
            code: "200",
            message: "success",
            result,
        });
    }
});

router.delete("/creditcard", async (req, res, next) => {
    const { memberId, cardSid } = req.query;

    console.log(memberId);

    if (!memberId) {
        res.json({
            success: false,
            code: "401",
            message: "no memberID",
        });
    }

    const sql = "DELETE FROM `credit_card` WHERE m_id = ? AND card_id = ?";

    const [result] = await db.query(sql, [memberId, cardSid]);

    console.log(result);

    if (!result.length) {
        res.json({
            success: false,
            code: "402",
            message: "no data",
        });
    } else {
        res.json({
            success: true,
            code: "200",
            message: "success",
            result,
        });
    }
});

router.get("/act/favlist", async (req, res) => {
    const { memberId, actSid } = req.query;
    const sqlFavlist = `SELECT * FROM favlist WHERE m_id = ? AND fav_list_type = 2 AND fav_list_kind= ?`;
    const [resultFav] = await db.query(sqlFavlist, [memberId, actSid]);
    console.log("get:", resultFav);
    res.json({
        success: true,
        code: 200,
        resultFav,
    });
});

router.get("/coupon/:userId", async (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);

    if (!userId) {
        return res.json({ message: "didn't get userId", code: "400" });
    }

    const sql = `SELECT * FROM  member_coupon mc JOIN memberdata m ON m.m_id = mc.m_id JOIN coupon c ON c.coupon_id = mc.coupon_id WHERE m.m_id =${userId}`;
    const [result] = await db.query(sql, [userId]);

    for (let i = 0; i < result.length; i++) {
        result[i].start_date = toDateString(result[i].start_date);
        result[i].expire_date = toDateString(result[i].expire_date);
    }

    if (!result.length) {
        return res.json({
            success: false,
            message: "沒有此用戶資料",
            code: "404",
        });
    } else {
        return res.json({
            success: true,
            code: "200",
            result,
        });
    }
});

router.put("/updatePassword/:userId", async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.json({ message: "didn't get userId", code: "400" });
    }

    if (!req.body.oldPassword) {
        return res.json({
            success: false,
            message: "oldPassword is empty",
            code: "400",
        });
    }
    if (!req.body.newPassword) {
        return res.json({
            success: false,
            message: "newPassword is empty",
            code: "401",
        });
    }
    if (!req.body.comfirmPassword) {
        return res.json({
            success: false,
            message: "comfirmPassword is empty",
            code: "402",
        });
    }

    if (req.body.newPassword !== req.body.comfirmPassword) {
        return res.json({
            success: false,
            message: "新密碼與確認密碼不符",
            code: "403",
        });
    }

    const getPwSql = "SELECT `m_passwd` FROM `memberdata` WHERE `m_id`=?";
    const [getPwResult] = await db.query(getPwSql, [userId]);

    if (!getPwResult.length) {
        return res.json({
            success: false,
            message: "沒有此用戶資料",
            code: "404",
        });
    } else {
        // console.log(getPwResult);
        // console.log(req.body.oldPassword);
        // console.log(getPwResult[0].m_passwd);

        const compare = await bcrypt.compare(
            req.body.oldPassword,
            getPwResult[0].m_passwd
        );

        console.log(compare);

        if (compare === true) {
            const newSql =
                "UPDATE `memberdata` SET  `m_passwd`=? WHERE `m_id`=?";

            const hashPw = await bcrypt.hash(req.body.newPassword, 10);

            const [newResult] = await db.query(newSql, [hashPw, userId]);

            console.log(newResult);

            return res.json({
                success: true,
                message: "修改成功",
                code: "200",
            });
        } else {
            return res.json({
                success: false,
                message: "輸入密碼與用戶密碼不符",
                code: "404",
            });
        }
    }
});

router.put("/:userId", async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.json({ message: "didn't get userId", code: "400" });
    }
    const user = req.body;

    if (!user.phone || !user.email) {
        return res.json({ message: "fail", code: "400" });
    }

    try {
        const sql =
            "UPDATE `memberdata` SET `m_first_name`=?,`m_last_name`=?,`m_birthday`=?,`m_email`=?,`m_phone`=?,`m_city`=?,`m_area`=?,`m_addr`=? WHERE m_id=?";

        const [result] = await db.query(sql, [
            user.firstname,
            user.lastname,
            user.birthday,
            user.email,
            user.phone,
            user.county,
            user.area,
            user.address,
            userId,
        ]);

        console.log(result);

        if (result.affectedRows) {
            return res.json({
                message: "success",
                code: "200",
                user: { ...user, id: userId },
            });
        }
    } catch (error) {
        return res.json({ message: error, code: "400" });
    }
});

router.delete("/favlist", async (req, res, next) => {
    const { member, roomSid } = await req.query;

    if (!member || !roomSid) {
        return res.json({ message: "無使用者資料", code: "400" });
    }

    const sql = "DELETE FROM `favlist` WHERE `fav_list_kind` =? AND m_id = ?";

    const [result] = await db.query(sql, [roomSid, member]);

    if (result.affectedRows === 0) {
        res.json({ message: "沒有資料被刪掉", code: "404" });
    }

    res.json(result);
});

router.get("/favlist/:userId", async (req, res, next) => {
    const userId = await req.params.userId;
    let output = {
        room: "",
        act: "",
    };
    console.log(userId);

    if (!userId) {
        return res.json({ message: "無使用者資料", code: "400" });
    }

    const sql =
        "SELECT `favlist_id`, aa.`m_id`, `fav_list_type`, `fav_list_kind`, bb.`room_name` ,`description` , `sid`,`room_image` ,dd.`favlist_type_id` , EE.room_folder FROM `favlist` AS aa ,`room` AS bb,`memberdata`AS cc ,`favlist_type` AS dd, `room_type` AS EE WHERE aa.m_id = cc.m_id AND aa.fav_list_type= 1 AND dd.favlist_type_id =1 AND aa.fav_list_kind = bb.sid AND EE.R_id = bb.room_type_id AND cc.m_id =?";

    const [result] = await db.query(sql, [userId]);

    const sql2 =
        "SELECT `favlist_id`, aa.`m_id`, `fav_list_type`, `fav_list_kind`, bb.`act_id`,`act_name` ,`act_desc`, dd.`favlist_type_id` , EE.`act_img_id` , `filename` FROM `favlist` AS aa ,`act` AS bb,`memberdata`AS cc ,`favlist_type` AS dd, `act_img` AS EE WHERE aa.m_id = cc.m_id AND aa.fav_list_type= 2 AND dd.favlist_type_id = 2 AND aa.fav_list_kind = bb.act_id AND EE.act_id = bb.act_id AND cc.m_id =? GROUP BY aa.favlist_id";

    const [result2] = await db.query(sql2, [userId]);

    console.log(result);
    console.log(result2);
    output.room = result;
    output.act = result2;

    res.json(output);
});

router.post("/favlist/act", async (req, res, next) => {
    console.log(req.body);

    const { favlistId, memberId, favType } = req.body;

    // 判斷是否已新增
    const sqlCountMemberAct =
        "SELECT COUNT(1) total FROM `favlist` f WHERE f.m_id = ? AND f.fav_list_kind = ?";
    const [[{ total }]] = await db.query(sqlCountMemberAct, [
        memberId,
        favlistId,
    ]);

    // 如果資料內沒有才加入
    if (!total) {
        const sqlInsertMemberAct =
            "INSERT INTO `favlist`(`m_id`, `fav_list_type`, `fav_list_kind`) VALUES (?,?,?)";

        const [add] = await db.query(sqlInsertMemberAct, [
            memberId,
            favType,
            favlistId,
        ]);
        console.log("add:", add);
        res.send(add);
    }
});

router.delete("/favlist/act/delete", async (req, res, next) => {
    const { memberId, favlistId } = req.query;

    const sql = "DELETE FROM `favlist` WHERE `m_id`=? AND`fav_list_kind`=?";

    const [result] = await db.query(sql, [memberId, favlistId]);

    console.log("delete:", result);
    res.send(result);
});

router.get("/getOrderList/:userId", async (req, res, next) => {
    const userId = await req.params.userId;

    //2022-08-11 00:00:00

    const { month } = req.query;

    let value = "";

    if (month === "一個月內") {
        value = 1;
        console.log(value);
    } else if (month === "三個月內") {
        value = 3;
        console.log(value);
    } else if (month === "六個月內") {
        value = 6;
        console.log(value);
    }

    if (!userId) {
        return res.json({ message: "此用戶不存在", code: "400" });
    }

    const sql =
        "SELECT m.m_id,od.* FROM  order_detail od JOIN memberdata m ON m.m_id = od.member_id WHERE member_id = ? AND  TIMESTAMPDIFF(MONTH, od.create_at, CURRENT_DATE) <= ? ";

    const [result] = await db.query(sql, [userId, value]);

    for (let i = 0; i < result.length; i++) {
        result[i].start_date = toDateString(result[i].start_date).split("-");
        result[i].end_date = toDateString(result[i].end_date).split("-");
    }

    console.log(result);

    if (result.length) {
        return res.json({
            message: "success",
            code: "200",
            result,
        });
    } else {
        return res.json({
            message: "no result",
            code: "400",
            result,
        });
    }
});

router.get("/:userId", async (req, res, next) => {
    const userId = await req.params.userId;

    console.log(userId);

    if (!userId) {
        return res.json({ message: "此用戶不存在", code: "400" });
    }

    const sql = "SELECT * FROM `memberdata` WHERE `m_id` = ?";

    try {
        const [result] = await db.query(sql, [userId]);

        result[0].m_birthday = toDateString(result[0].m_birthday);
        result[0].create_at = toDateString(result[0].create_at);

        console.log(result[0].create_at);

        if (result.length > 0) {
            return res.json({
                message: "success",
                code: "200",
                user: result[0],
            });
        } else {
            return res.json({ message: "fail", code: "204" });
        }
    } catch (error) {
        console.log("error occurred: ", error);
        return res.json({ message: "error", code: "500" });
    }
});

// router 一定要回傳module
module.exports = router;
