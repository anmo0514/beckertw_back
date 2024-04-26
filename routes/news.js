const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const news = require(__dirname + "../../controllers/news_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('news_id').trim().notEmpty().isInt(),
        body('cate_id').trim().isInt().optional({nullable: true}),
        body('art_type').trim().isInt().optional({nullable: true}),
        body('is_top').trim().isInt().optional({nullable: true}),
        body('status').trim().isInt().optional({nullable: true}),
        body('title').trim().isString().isLength({max:59}).optional({nullable: true}),
        body('intro').trim().isString().isLength({max:104}).optional({nullable: true}),
        body('content').trim().isString().isLength({max:10448}).optional({nullable: true}),
        body('cover_1').trim().isString().isLength({max:40}).optional({nullable: true}),
        body('art_date').trim().isString().isLength({max:10}).optional({nullable: true}),
        body('disp_order').trim().isInt().optional({nullable: true}),
        body('create_date').trim().isString().isLength({max:16}).optional({nullable: true}),
        body('update_date1').trim().isString().isLength({max:16}).optional({nullable: true}),
        body('link').trim().isString().isLength({max:48}).optional({nullable: true}),
    ], validate, news.update
);

router.get('/:news_id', [param('news_id').isInt()], validate, news.get);

router.get('/', news.getAll);

router.post('/', [
        body('cate_id').trim().notEmpty().isInt(),
        body('art_type').trim().notEmpty().isInt(),
        body('is_top').trim().notEmpty().isInt(),
        body('status').trim().notEmpty().isInt(),
        body('title').trim().isString().isLength({max:59}).optional({nullable: true}),
        body('intro').trim().isString().isLength({max:104}).optional({nullable: true}),
        body('content').trim().isString().isLength({max:10448}).optional({nullable: true}),
        body('cover_1').trim().isString().isLength({max:40}).optional({nullable: true}),
        body('art_date').trim().isString().isLength({max:10}).optional({nullable: true}),
        body('disp_order').trim().isInt().optional({nullable: true}),
        body('create_date').trim().isString().isLength({max:16}).optional({nullable: true}),
        body('update_date1').trim().isString().isLength({max:16}).optional({nullable: true}),
        body('link').trim().isString().isLength({max:48}).optional({nullable: true}),
    ], validate, news.insert
);

router.delete('/:news_id', [param('news_id').trim().notEmpty().isInt()], validate, news.deleted);

module.exports = router;
