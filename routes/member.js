const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const member = require(__dirname + "../../controllers/member_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/resetpassword', [
        body('mem_id').trim().notEmpty().isInt(),
        body('oldPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('newPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('repassword').trim().notEmpty().isString().isLength({min:6, max:200}).custom((value, {req})=>{
            if(!verify.commonString(value)) throw new Error('Invalid string in password.');
            if(value !== req.body.repassword) throw new Error('Passwords are inconsistent.');
            return true;
        }),
    ], validate, member.resetPassword
);

router.get('/p/:page/:rows', member.getAllByPage);

router.get('/count/', member.getCount);

router.get('/:mem_id', [param('mem_id').trim().notEmpty().isInt()], validate, member.get);

router.get('/', member.getAll);

router.put('/status', [
        body('mem_id').trim().notEmpty().isInt(), 
        body('account_status').trim().notEmpty().isInt(),        
    ], validate, member.changeStatus
);

router.put('/', [ 
        body('mem_id').trim().notEmpty().isInt(),
        body('password', 'Invalid password format.').trim().notEmpty().isLength({min:6, max:200}),
        body('chinese_name', 'Invalid Chinese name. Do not use illegal symbol.').trim().isString().isLength({max:200}).custom((value) => {
            if(verify.identiferString(value) || !value) return true;
            throw new Error('Invalid string in Chinese name.');
        }).optional({nullable: true}),
        body('first_name', 'Invalid first name. Do not use illegal symbol.').trim().isString().custom((value) => {
            if(verify.identiferString(value) || !value) return true;
            throw new Error('Invalid string in first name.');
        }).optional({nullable: true}),
        body('last_name', 'Invalid last name. Do not use illegal symbol.').trim().isString().custom((value) => {
            if(verify.identiferString(value) || ! value) return true;
            throw new Error('Invalid string in last name.');
        }).optional({nullable: true}),
        body('purchase_date').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
        body('auth').trim().isString().isLength({max:10}).optional({nullable: true}),
        body('comment').trim().isString().optional({nullable: true}),
        body('active_date').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
        body('user_type').trim().isString().isLength({max:512}).optional({nullable: true}),
        body('id_num').trim().isString().isLength({max:20}).optional({nullable: true}),
        body('phone_num').trim().isInt().isLength({max:40}).optional({nullable: true}),
        body('email').trim().toLowerCase().isEmail().isLength({max:255}).optional({nullable: true}),
        body('address').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('status').trim().isInt().optional({nullable: true}),
        body('school').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('major').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('grade').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('industry').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('company_name').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('info_way').trim().isString().isLength({max:255}).optional({nullable: true}),
        body('pass').trim().isInt().optional({nullable: true}),
        body('postpone').trim().isInt().optional({nullable: true}),
        body('refund').trim().isInt().optional({nullable: true}),
        body('account_status').trim().isInt().optional({nullable: true}),
    ], validate, member.update
);

router.post('/', [
        body('chinese_name', 'Invalid Chinese name. Do not use illegal symbol.').trim().notEmpty().isString().isLength({max:200}).custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in Chinese name.');
        }),
        body('account', 'Invalid account format.').trim().notEmpty().toLowerCase().isEmail().isLength({max:200}),
        body('password', 'Invalid password format.').trim().notEmpty().isLength({min:6, max:200}),
        body('first_name', 'Invalid first name. Do not use illegal symbol.').trim().isString().custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in first name.');
        }).optional({nullable: true}),
        body('last_name', 'Invalid last name. Do not use illegal symbol.').trim().isString().custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in last name.');
        }).optional({nullable: true}),
        body('purchase_date').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
        body('auth').trim().isString().isLength({max:10}).default("").optional({nullable: true}),
        body('comment').trim().isString(),
        body('active_date').trim().custom((value) => {
            if (value) {
                if (!verify.isDate(value)) throw new Error ("Date type error");
                return true;
            } return true;
        }).optional({nullable: true}),
        body('user_type').trim().notEmpty().isString().isLength({max:512}).default("CPA"),
        body('id_num').trim().isString().isLength({max:20}),
        body('phone_num').trim().notEmpty().isString().isLength({max:40}),
        body('email').trim().notEmpty().toLowerCase().isEmail().isLength({max:255}),
        body('address').trim().notEmpty().isString().isLength({max:255}),
        body('status').trim().notEmpty().isInt(),
        body('school').trim().isString().isLength({max:255}),
        body('major').trim().isString().isLength({max:255}),
        body('grade').trim().isString().isLength({max:255}),
        body('industry').trim().isString().isLength({max:255}),
        body('company_name').trim().isString().isLength({max:255}),
        body('info_way').trim().isString().isLength({max:255}),
        body('pass').trim().isInt().optional({nullable: true}).default(0),
        body('postpone').trim().isInt().optional({nullable: true}).default(0),
        body('refund').trim().isInt().optional({nullable: true}).default(0),
        body('account_status').trim().isInt().optional({nullable: true}).default(1),
    ], validate, member.register
);

router.delete('/:mem_id', [param('mem_id').trim().notEmpty().isInt()], validate, member.deleted);


module.exports = router;

/*
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
*/