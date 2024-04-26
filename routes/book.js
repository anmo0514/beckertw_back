const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const book = require(__dirname + "../../controllers/book_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('receive_book_id').trim().notEmpty().isInt(),
        body('order_id').trim().isInt().optional({nullable:true}),
        body('course_id').trim().isInt().optional({nullable:true}),
        body('final_review').trim().isInt().optional({nullable:true}),
        body('flash_card').trim().isInt().optional({nullable:true}),
        body('status').trim().isInt().optional({nullable:true}),
    ], validate, book.update
);

router.get('/:receive_book_id', [param('receive_book_id').isInt().optional({nullable:true})], validate, book.get);

router.get('/', book.getAll);

router.post('/', [
        body('order_id').trim().notEmpty().isInt(),
        body('course_id').trim().notEmpty().isInt(),
        body('final_review').trim().notEmpty().isInt(),
        body('flash_card').trim().notEmpty().isInt(),
        body('status').trim().notEmpty().isInt(),
    ], validate, book.insert
);

router.delete('/:book_id', [param('book_id').trim().notEmpty().isInt()], validate, book.deleted);

module.exports = router;
