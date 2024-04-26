require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const mem = require(__dirname + "../../models/mem_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");



const memberlogout = (req, res, next) => {
    req.session.destroy();
    req.token = null;
    res.clearCookie('token', {path:'/cookie'});
    res.redirect(p.memberlogin);
}

const teacherlogout = (req, res, next) => {
    req.session.destroy();
    req.token = null;
    res.clearCookie('token', {path:'/cookie'});
    res.redirect(p.teacherlogin);
}

const adminlogout = (req, res, next) => {
    req.session.destroy();
    req.token = null;
    res.clearCookie('token', {path:'/cookie'});
    res.redirect(p.adminlogin);
}

module.exports = {
    memberlogout,
    teacherlogout,
    adminlogout,
}