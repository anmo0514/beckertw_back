const express = require("express");
// 連結到資料庫
const path = require("path");
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

router.get('/sharesEssence', async (req, res) => {
    try {
        const sqlSelect = `SELECT * FROM art WHERE cate_id IN (584, 583, 582, 581)`;
        const [result] = await db.query(sqlSelect);
        res.json(result);
    } catch (error) {
        console.error("Error fetching share data:", error);
        res.status(500).json({ error: "An error occurred while fetching share data." });
    }
});

const getShareByYearHandler = async (cateId) => {
    try {
        const sqlSelect = `SELECT * FROM art WHERE cate_id = ?`;
        const [result] = await db.query(sqlSelect, [cateId]);
        return result;
    } catch (error) {
        console.error("Error fetching share data:", error);
        throw new Error("An error occurred while fetching share data.");
    }
};

router.get("/selectShareByYear/:cateId", async (req, res) => {
    try {
        const cateId = req.params.cateId;
        const output = await getShareByYearHandler(cateId);
        res.json(output);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// router 一定要回傳module
module.exports = router;
