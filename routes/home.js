const express = require("express");
// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

const getActHandler = async (req, res) => {
    let output = {
        roomtype1: [],
        roomtype2: [],
        roomtype3: [],
        roomtype4: [],
    };
    

        const sqlSelectRoom1 = `SELECT * FROM room r JOIN room_type rt ON r.room_type_id = rt.R_id WHERE r.room_type_id = 1`;
        const [r1] = await db.query(sqlSelectRoom1);
        output.roomtype1 = r1;

        const sqlSelectRoom2 = `SELECT * FROM room r JOIN room_type rt ON r.room_type_id = rt.R_id WHERE r.room_type_id = 2`;
        const [r2] = await db.query(sqlSelectRoom2);
        output.roomtype2 = r2;

        const sqlSelectRoom3 = `SELECT * FROM room r JOIN room_type rt ON r.room_type_id = rt.R_id WHERE r.room_type_id = 3`;
        const [r3] = await db.query(sqlSelectRoom3);
        output.roomtype3 = r3;

        const sqlSelectRoom4 = `SELECT * FROM room r JOIN room_type rt ON r.room_type_id = rt.R_id WHERE r.room_type_id = 4`;
        const [r4] = await db.query(sqlSelectRoom4);
        output.roomtype4 = r4;

        return output;
};

    // 房型資訊
router.get("/selectRoom", async (req, res) => {
    const output = await getActHandler(req, res);
    res.json(output);
});
// router 一定要回傳module
module.exports = router;
