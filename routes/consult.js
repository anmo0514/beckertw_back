const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const consult = require(__dirname + "../../controllers/consult_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('consult_id').trim().notEmpty().isInt(),
        body('mem_id').trim().isInt().optional({nullable: true}),
        body('first_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('sec_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('third_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('pass').trim().isInt().optional({nullable: true}),
        body('memo').trim().trim().isString().isLength({max:255}).optional({nullable: true}),
    ], validate, consult.update
);

router.get('/:consult_id', [param('consult_id').isInt()], validate, consult.get);

router.get('/', consult.getAll);

router.post('/', [
        body('mem_id').trim().isInt().notEmpty(),
        body('first_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('sec_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('third_record').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('pass').trim().isInt().optional({nullable: true}),
        body('memo').trim().trim().isString().isLength({max:255}).optional({nullable: true}),
    ], validate, consult.insert
);

router.delete('/:consult_id', [param('consult_id').trim().notEmpty().isInt()], validate, consult.deleted);

module.exports = router;
