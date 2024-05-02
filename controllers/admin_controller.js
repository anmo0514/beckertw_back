require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const admin = require(__dirname + "../../models/admin_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");


const resetPassword = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        const result = await admin.resetPassword(req);
        res.json(result);
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const get = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await admin.get(req.params.admin_id));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const getAll = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await admin.getAll());
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const changeStatus = async (req, res, next) => {
    if (await pm.modifyAdmin(req, req.body.admin_id)) {
        res.json(await admin.changeStatus(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const update = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await admin.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const register = async (req, res, next) => {
    // if (await pm.modifyAdmin(req)) {
        await admin.register(req, res, next);
    // } else {
    //     res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    // }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await admin.deleted(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

module.exports = {
    resetPassword,
    register,
    get,
    getAll,
    update,
    deleted,
    changeStatus,
}