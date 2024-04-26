require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const art = require(__dirname + "../../models/art_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");


const get = async (req, res, next) => {
    res.json(await art.get(req));
}

const getAll = async (req, res, next) => {
    res.json(await art.getAll(req));
}

const update = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await art.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const insert = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await art.insert(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await art.deleted(req));
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