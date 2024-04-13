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

        actAtv: [],
        actUpstream: [],
        actNight: [],
        actFloat: [],
        
    };

    let whereFloatimg = `WHERE act_img.act_id = 1`;
    let whereUpstreamimg = `WHERE act_img.act_id = 3`;
    let whereAtvimg = `WHERE act_img.act_id = 5`;
    let whereNightimg = `WHERE act_img.act_id = 8`;

        const sqlSelectFloat = `SELECT * FROM act JOIN act_img ON act.act_id = act_img.act_id ${whereFloatimg}`;
        const [r1] = await db.query(sqlSelectFloat);
        output.actFloat = r1;
        
        const sqlSelectUpstream = `SELECT * FROM act JOIN act_img ON act.act_id = act_img.act_id ${whereUpstreamimg}`;
        const [r2] = await db.query(sqlSelectUpstream);
        output.actUpstream = r2;

        const sqlSelectAtv = `SELECT * FROM act JOIN act_img ON act.act_id = act_img.act_id ${whereAtvimg}`;
        const [r3] = await db.query(sqlSelectAtv);
        output.actAtv = r3;

        const sqlSelectNight = `SELECT * FROM act JOIN act_img ON act.act_id = act_img.act_id ${whereNightimg}`;
        const [r4] = await db.query(sqlSelectNight);
        output.actNight = r4;

        return output;
};

    // 活動
router.get("/selectAct", async (req, res) => {
    const output = await getActHandler(req, res);
    res.json(output);
});
// router 一定要回傳module
module.exports = router;
