const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const order = require(__dirname + "../../controllers/order_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('order_id').trim().notEmpty().isInt(),
        body('mem_id').trim().isInt().optional({nullable: true}),
        body('product_id').trim().isInt().optional({nullable: true}),
        body('discount_id').trim().isInt().optional({nullable: true}),
        body('mou_id').trim().isInt().optional({nullable: true}),
        body('partner_id').trim().isInt().optional({nullable: true}),
        body('total_price').trim().isInt().optional({nullable: true}),
        body('software_ex').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
        body('extension').trim().isInt().optional({nullable: true}),
        body('memo').trim().isInt().optional({nullable: true}),
    ], validate, order.update
);

router.get('/:order_id', [param('order_id').isInt().optional({nullable:true})], validate, order.get);

router.get('/', order.getAll);

router.post('/', [
        body('mem_id').trim().notEmpty().isInt(),
        body('product_id').trim().notEmpty().isInt(),
        body('discount_id').trim().isInt().optional({nullable: true}),
        body('mou_id').trim().isInt().optional({nullable: true}),
        body('partner_id').trim().isInt().optional({nullable: true}),
        body('total_price').trim().notEmpty().isInt(),
        body('software_ex').trim().notEmpty().custom((value) => {
            if (!verify.isDate(value)) throw new Error ("Date type error");
            return true;
        }),
        body('extension').trim().notEmpty().isInt(),
        body('memo').trim().isInt().notEmpty().optional({nullable: true}),
    ], validate, order.insert
);

router.delete('/:order_id', [param('order_id').trim().notEmpty().isInt()], validate, order.deleted);

module.exports = router;
