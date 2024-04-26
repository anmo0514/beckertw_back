const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const qa = require(__dirname + "../../controllers/qa_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/', [
        body('qa_id').trim().notEmpty().isInt(),
        body('mem_id').trim().isInt().optional({nullable: true}),
        body('subject').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('xtype').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('cpa').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('chapter').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('sim_set').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('question').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('moc_set').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('testlet').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('moc').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('my_answer').trim().isString().optional({nullable: true}),
        body('my_question').trim().isString().optional({nullable: true}),
        body('teacher_id').trim().isInt().optional({nullable: true}),
        body('reply_status').trim().isInt().optional({nullable: true}),
        body('reply').trim().isString().optional({nullable: true}),
        body('draft').trim().isString().optional({nullable: true}),
        body('deny_reason').trim().isString().optional({nullable: true}),
        body('reply_date').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
    ], validate, qa.update
);

router.get('/:qa_id', [param('qa_id').isInt()], validate, qa.get);

router.get('/', qa.getAll);

router.post('/', [
        body('mem_id').trim().notEmpty().isInt(),
        body('subject').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('xtype').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('cpa').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('chapter').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('sim_set').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('question').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('moc_set').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('testlet').trim().isString().isLength({max:512}).default('').optional({nullable: true}),
        body('moc').trim().notEmpty().isString().isLength({max:512}).default(''),
        body('my_answer').trim().notEmpty().isString().default(''),
        body('my_question').trim().notEmpty().isString().default(''),
        body('teacher_id').trim().notEmpty().isInt().default(0),
        body('reply_status').trim().notEmpty().isInt().default(0),
        body('reply').trim().isString().optional({nullable: true}),
        body('draft').trim().isString().optional({nullable: true}),
        body('deny_reason').trim().isString().optional({nullable: true}),
    ], validate, qa.insert
);

router.delete('/:qa_id', [param('qa_id').trim().notEmpty().isInt()], validate, qa.deleted);

module.exports = router;
