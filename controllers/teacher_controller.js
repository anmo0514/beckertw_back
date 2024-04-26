require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const teacher = require(__dirname + "../../models/teacher_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");

const resetPassword = async (req, res, next) => {
    if (await pm.modifyTeacher(req, req.body.teacher_id)) {
        const result = await teacher.resetPassword(req);
        res.json(result);
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const get = async (req, res, next) => {
    if (await pm.modifyTeacher(req, req.body.teacher_id)) {
        res.json(await teacher.get(req.params.teacher_id));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const getAll = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await teacher.getAll());
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const update = async (req, res, next) => {
    if (await pm.modifyTeacher(req, req.body.teacher_id)) {
        res.json(await teacher.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const changeStatus = async (req, res, next) => {
    if (await pm.modifyTeacher(req, req.body.teacher_id)) {
        res.json(await teacher.changeStatus(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const register = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        await teacher.register(req, res, next);
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await teacher.deleted(req));
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