const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const {body, param}  = require("express-validator");
const { exists } = require("../modules/verify");
const admin = require(__dirname + "../../controllers/admin_controller");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.put('/resetpassword', [
        body('admin_id').trim().notEmpty().isInt(),
        body('oldPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('newPassword').trim().notEmpty().isString().isLength({min:6, max:200}),
        body('repassword').trim().notEmpty().isString().isLength({min:6, max:200}).custom((value, {req})=>{
            if(!verify.commonString(value)) throw new Error('Invalid string in password.');
            if(value !== req.body.repassword) throw new Error('Passwords are inconsistent.');
            return true;
        }),
    ], validate, admin.resetPassword
);

router.put('/status', [
        body('admin_id').trim().notEmpty().isInt(), 
        body('status').trim().notEmpty().isInt(),        
    ], validate, admin.changeStatus
);

router.put('/', [
        body('admin_id').trim().notEmpty().isInt(),
        body('name', 'Invalid name. Do not use illegal symbol.').trim().notEmpty().isString().isLength({min:1, max:512}).custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in name.');
        }),
        body('status').trim().isInt().optional({nullable:true}),
    ], validate, admin.update
);

router.get('/:admin_id', [param('admin_id').notEmpty().isInt()], validate, admin.get);

router.get('/', admin.getAll);

router.post('/', [
        body('name', 'Invalid name. Do not use illegal symbol.').trim().notEmpty().isString().isLength({min:1, max:512}).custom((value) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in name.');
        }),
        body('account', 'Invalid email format.').trim().notEmpty().toLowerCase().isEmail().isLength({min:2, max:200}),
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
        body('status').trim().isInt().optional({nullable:true}).default(1),
    ], validate, admin.register
);

router.delete('/:admin_id', [param('admin_id').trim().notEmpty().isInt()], validate, admin.deleted);

module.exports = router;
