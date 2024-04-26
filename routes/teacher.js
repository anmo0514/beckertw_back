const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const teacher = require(__dirname + "../../controllers/teacher_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/resetpassword', [
        body('teacher_id').trim().notEmpty().isInt(),
        body('oldPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('newPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('repassword').trim().notEmpty().isString().isLength({min:6, max:200}).custom((value, {req})=>{
            if(!verify.commonString(value)) throw new Error('Invalid string in password.');
            if(value !== req.body.repassword) throw new Error('Passwords are inconsistent.');
            return true;
        }),
    ], validate, teacher.resetPassword
);

router.put('/status', [
        body('teacher_id').trim().notEmpty().isInt(), 
        body('status').trim().notEmpty().isInt(),        
    ], validate, teacher.changeStatus
);

router.put('/', [
        body('teacher_id').trim().notEmpty().isInt(),
        body('name', 'Invalid name. Do not use illegal symbol.').trim().notEmpty().isString().isLength({max:512}).custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in name.');
        }).optional({nullable:true}),
        body('subject').trim().isString().optional({nullable:true}),
        body('xtype').trim().isString().optional({nullable:true}),
        body('subject2').trim().isString().optional({nullable:true}),
        body('xtype2').trim().isString().optional({nullable:true}),
        body('status').trim().isInt().optional({nullable:true}),
    ], validate, teacher.update
);

router.get('/:teacher_id', [param('teacher_id').trim().notEmpty().isInt()], validate, teacher.get);

router.get('/', teacher.getAll);

router.post('/', [
        body('name', 'Invalid name. Do not use illegal symbol.').trim().notEmpty().isString().isLength({min:1, max:512}).custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in name.');
        }),
        body('email', 'Invalid email format.').trim().notEmpty().toLowerCase().isEmail().isLength({max:200}),
        body('password', 'Invalid password format.').trim().notEmpty().isLength({min:6, max:200}).custom((value, {req}) => {
            if(!verify.commonString(value)) throw new Error('Invalid string in password.');
            if(value !== req.body.repassword) throw new Error('Passwords are inconsistent.');
            return true;
        }),
        body('repassword', 'Invalid repassword format.').trim().notEmpty().isLength({min:6, max:200}).custom((value, {req}) => {
            if(!verify.commonString(value)) throw new Error('Invalid string in repassword.');
            if(value !== req.body.password) throw new Error('Passwords are inconsistent.');
            return true;
        }),
        body('subject').trim().notEmpty().isString(),
        body('xtype').trim().notEmpty().isString(),
        body('subject2').trim().notEmpty().isString(),
        body('xtype2').trim().notEmpty().isString(),
        body('status').trim().isInt().optional({nullable:true}),
    ], validate, teacher.register
);

router.delete('/:teacher_id', [param('teacher_id').trim().notEmpty().isInt()], validate, teacher.deleted);


module.exports = router;
