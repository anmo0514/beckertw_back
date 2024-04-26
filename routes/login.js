const express = require("express");
// 連結到資料庫
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const login = require(__dirname + "../../controllers/login_controller");
const {body, param}  = require("express-validator");


//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

router.post('/member', [
        body('account', 'Account is required.').trim().notEmpty().isEmail(),
        body('password', 'Password is required.').trim().notEmpty().isString()
    ], validate, login.memberLogin
);

router.post('/employee', [
        body('account', 'Account is required.').trim().notEmpty().isEmail(),
        body('password', 'Password is required.').trim().notEmpty().isString()
    ], validate, login.employeeLogin
);

module.exports = router;
