const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const art = require(__dirname + "../../controllers/art_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('art_id').trim().notEmpty().isInt(),
        body('cate_id').trim().isInt().optional({nullable: true}),
        body('art_type').trim().isInt().optional({nullable: true}),
        body('is_top').trim().isInt().optional({nullable: true}),
        body('status').trim().isInt().optional({nullable: true}),
        body('privilege').trim().isInt().optional({nullable: true}),
        body('cate_status').trim().isInt().optional({nullable: true}),
        body('title').trim().isString().isLength({max:512}).default("").optional({nullable: true}),
        body('intro').trim().isString().optional({nullable: true}),
        body('content').trim().isString().optional({nullable: true}),
        body('link').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('target').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('cover_1').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('art_date').trim().isDate().optional({nullable: true}),
        body('disp_order').trim().isInt().optional({nullable: true}),
    ], validate, art.update
);

router.get('/:art_id', [param('art_id').isInt()], validate, art.get);

router.get('/', art.getAll);

router.post('/', [
        body('cate_id').trim().notEmpty().isInt(),
        body('art_type').trim().notEmpty().isInt().default(1),
        body('is_top').trim().notEmpty().isInt().default(0),
        body('status').trim().notEmpty().isInt().default(0),
        body('privilege').trim().notEmpty().isInt().default(0),
        body('cate_status').trim().notEmpty().isInt().default(0),
        body('title').trim().isString().isLength({min:0, max:512}).default(""),
        body('intro').trim().isString().optional({nullable: true}),
        body('content').trim().isString().optional({nullable: true}),
        body('link').trim().isString().isLength({min:0, max:512}).default(""),
        body('target').trim().isString().isLength({min:0, max:512}).default("_self"),
        body('cover_1').trim().isString().isLength({min:0, max:512}).default(""),
        body('art_date').trim().isDate(),
        body('disp_order').trim().notEmpty().isInt().default(0),
    ], validate, art.insert
);

router.delete('/:art_id', [param('art_id').trim().notEmpty().isInt()], validate, art.deleted);

module.exports = router;
