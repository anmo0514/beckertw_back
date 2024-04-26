require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const consult = require(__dirname + "../../models/consult_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");


const get = async (req, res, next) => {
    res.json(await consult.get(req));
}

const getAll = async (req, res, next) => {
    res.json(await consult.getAll(req));
}

const update = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await consult.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const insert = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await consult.insert(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await consult.deleted(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}