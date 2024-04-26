const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const product = require(__dirname + "../../controllers/product_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('product_id').trim().notEmpty().isInt(),
        body('name').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('parent_id').trim().isInt().optional({nullable: true}),
        body('price').trim().isInt().optional({nullable: true}),
    ], validate, product.update
);

router.get('/:product_id', [param('product_id').isInt()], validate, product.get);

router.get('/', product.getAll);

router.post('/', [
        body('name').trim().notEmpty().isString().isLength({max:255}),
        body('parent_id').trim().notEmpty().isInt(),
        body('price').trim().notEmpty().isInt(),
    ], validate, product.insert
);

router.delete('/:product_id', [param('product_id').trim().notEmpty().isInt()], validate, product.deleted);

module.exports = router;
