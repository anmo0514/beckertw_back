const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const course = require(__dirname + "../../controllers/course_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('course_id').trim().notEmpty().isInt(),
        body('name').trim().isString().isLength({max:255}).optional({nullable:true}),
        body('parent_id').trim().isInt().optional({nullable:true}),
    ], validate, course.update
);

router.get('/:course_id', [param('course_id').isInt().optional({nullable:true})], validate, course.get);

router.get('/', course.getAll);

router.post('/', [
        body('name').trim().notEmpty().isString().isLength({max:255}),
        body('parent_id').trim().notEmpty().isInt(),
    ], validate, course.insert
);

router.delete('/:course_id', [param('course_id').trim().notEmpty().isInt()], validate, course.deleted);

module.exports = router;
