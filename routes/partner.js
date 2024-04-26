const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const partner = require(__dirname + "../../controllers/partner_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('partner_id').trim().notEmpty().isInt(),
        body('name').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('discount').trim().isInt().optional({nullable: true}),
        body('status').trim().isInt().optional({nullable: true}),
        body('memo').trim().isString().isLength({max:255}).optional({nullable: true}),
    ], validate, partner.update
);

router.get('/:partner_id', [param('partner_id').isInt()], validate, partner.get);

router.get('/', partner.getAll);

router.post('/', [
        body('name').trim().notEmpty().isString().isLength({max:255}),
        body('discount').trim().notEmpty().isInt(),
        body('status').trim().notEmpty().isInt(),
        body('memo').trim().isString().isLength({max:255}).optional({nullable: true}),
    ], validate, partner.insert
);

router.delete('/:partner_id', [param('partner_id').trim().notEmpty().isInt()], validate, partner.deleted);

module.exports = router;
