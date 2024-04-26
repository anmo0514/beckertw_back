require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const mem = require(__dirname + "../../models/mem_model");
const teacher = require(__dirname + "../../models/teacher_model");
const admin = require(__dirname + "../../models/admin_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");

const checkLoginStatus = async (req, res, next) => {
    /**
     * Middleway to handle login status or not, you can just use modules.verify.verifyLoginStatus to validate client request.
     */
    const userData = await verify.verifyLoginStatus(req);
    if (userData) res.json({userData: userData});
    else res.redirect(p.Login);
}

const memberLogin = async (req, res, next) => {
    /**
     * For member login entry, login with jwt, session, cookie, and all expired after 10 hours.
     */
    const { account, password } = req.body;
    const result = await mem.loginValidator(account, password);
    console.log(result);
    if (result) {
        if (result.status === 200){
            const token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 10), 
                data: {
                    id: result.data.mem_id,
                    type: 'member',
                }
            }, process.env.JWT_SECRET);
            req.session.token = token;
            res.cookie('token', token, { path: '/cookie', signed: true, maxAge: 60 * 60 * 10 * 1000});
            res.setHeader('token', token);
        } 
    }
    res.json(result);
}

const employeeLogin = async (req, res, next) => {
    /**
     * For admin (manager) and teacher entry, login with jwt, session, cookie, and all expired after 10 hours.
     */
    const { account, password } = req.body;
    let result;
    let id = "";
    let type = ""
    let dbAccount = "";
    let name = "";

    result = await teacher.loginValidator(account, password); 
    if (result.status === 404) {
        result = await admin.loginValidator(account, password); 
        if (result.status !== 404) { 
            id = result.data.admin_id; 
            type = 'admin';
            dbAccount = result.data.account; 
            name = result.data.name; 
        }
    } else {
        id = result.data.teacher_id; 
        type = 'teacher';
        dbAccount = result.data.email; 
        name = result.data.name; 
    }
    if (result && id) {
        if (result.status === 200){
            const token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 10), 
                data: {
                    authorized: true,
                    sid: id,
                    id: id,
                    type: type,
                    account: dbAccount,
                    name: name,
                }
            }, process.env.JWT_SECRET);
            req.session.token = token;
            res.cookie('token', token, { path: '/cookie', signed: true, maxAge: 60 * 60 * 10 * 1000});
            res.setHeader('token', token);
            result.data = {...result.data, token:token, authorized:true}
            result.data.password = null;
            //return res.redirect("http://localhost:3000/adm/admh")
        } 
    }
    res.json(result);
}

module.exports = {
    checkLoginStatus,
    memberLogin,
    employeeLogin,
}