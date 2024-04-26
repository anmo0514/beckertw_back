require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const mem = require(__dirname + "../../models/mem_model");
const teacher = require(__dirname + "../../models/teacher_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");

const resetPassword = async (req, res, next) => {
    if (await pm.modifyMember(req, req.body.mem_id)) {
        const result = await mem.resetPassword(req);
        res.json(result);
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    } 
}

const get = async (req, res, next) => {
    if (await pm.modifyMember(req, req.body.mem_id)) {
        res.json(await mem.get(req.params.mem_id));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }    
}

const getAll = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await mem.getAll());
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }    
}

const update = async (req, res, next) => {
    if (await pm.modifyMember(req, req.body.mem_id)) {
        res.json(await mem.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }   
}

const register = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        await mem.register(req, res, next);
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }  
}

const changeStatus = async (req, res, next) => {
    if (await pm.modifyMember(req, req.body.mem_id)) {
        res.json(await mem.changeStatus(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await mem.deleted(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

module.exports = {
    resetPassword,
    get,
    getAll,
    update,
    register,
    changeStatus,
    deleted,
}