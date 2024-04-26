const express = require("express");
// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
const dbe = require(__dirname + "../../modules/mysql-excute");
const l = require(__dirname + "../../modules/logs");
const dt = require(__dirname + "../../modules/date-tools");
const mem = require(__dirname + "../../models/mem_model");
const login = require(__dirname + "../../controllers/login_controller");
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const verify = require(__dirname + "../../modules/verify");
const {validate} = require(__dirname + "../../controllers/validationHandler_controller");
const tools = require(__dirname + "../../modules/tools");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");
const {body, header, validationResult}  = require("express-validator");
const { loginValidator } = require("../models/mem_model");

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());


const getTestHandler = async (req, res) => {
    //const t1 = req.params; //GET
    //const t2 = req.body; //POST
    //let output = 'this is test';
    
    //const sql = ["INSERT INTO `test` (`name`, `age`) VALUES (?, ?)", "INSERT INTO `test` (`name`, `age`) VALUES (?, ?)", "INSERT INTO `test` (`name`, `age`) VALUES (?, ?)", ];
    //const params = [["aa", 2], ['acv', "as"], ["asd", 5]]
    //return verify.stringAbleOrArray(sql); 
    //const sql = "UPDATE `test` SET `name` = 'drddjdt' WHERE `id` = 110"
    //const params = null
    //const sql = "INSERT INTO `test` (`name`, `age`) VALUES (?, ?)";
    //const param = ['acv', "dd"]
    //return verify.number("-1345601.1", 2, 10, "img");
    //return await dbe.transaction(sql, params, true);
    //if (Object.keys([]).length) return 1;
    const a = ['asd'].join(" AND ");
    let b = 'asd'
    return toDatetimeString(Date.now());

}

router.get('/ttt/:ttt', async (req, res) => {
    let output = await getTestHandler(req, res);
    res.json(output);
})

router.post('/ttt', [
    body('date').trim().custom((value) => {
        if (value) {
            if (!verify.isDate(value)) throw new Error ("Date type error");
            return true;
        } return true;
    }).optional({nullable: true})
], validate, async (req, res, next) => {
    let a = {
        test: "ok"
    }
    res.json(a);
})

router.post('/mem', [
        body('ch_name', 'Invalid Chinese name. Do not use illegal symbol.').notEmpty().trim().isString().custom((value, {req}) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in Chinese name.');
        }),
        body('first_name', 'Invalid first name. Do not use illegal symbol.').trim().isString().custom((value, {req}) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in first name.');
        }),
        body('last_name', 'Invalid last name. Do not use illegal symbol.').trim().isString().custom((value, {req}) => {
            if(verify.identiferString(value)) return true;
            throw new Error('Invalid string in last name.');
        }),
        body('account', 'Invalid account format.').trim().toLowerCase().isEmail(),
        body('password', 'Invalid password format.').trim().isLength({min:6, max:36}),
        body('repassword', 'Invalid repassword format.').trim().isLength({min:6, max:36}),
    ], 
    validate,
    mem.register
);

router.post('/memlogin',[
    body('account', 'Account required.').trim().notEmpty().toLowerCase().isEmail(),
    body('password', 'Password required.').trim().notEmpty().isLength({min:6, max:36}),
    body('type', 'Type required.').trim().notEmpty().toLowerCase().isString(),
], validate, login.memberLogin);

router.post('/memlogincheck', login.checkLoginStatus);


// router 一定要回傳module
module.exports = router;