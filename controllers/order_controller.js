require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbe = require(__dirname + "../../modules/mysql-excute");
const order = require(__dirname + "../../models/order_model");
const verify = require(__dirname + "../../modules/verify");
const p = require(__dirname + "../../modules/path");
const pm = require(__dirname + "../../modules/permissions");


const get = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await order.get(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const getAll = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await order.getAll(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const update = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await order.update(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const insert = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await order.insert(req));
    } else {
        res.json(new dbe.QueryResult([{}], "You don't have the permissions. ", 403))
    }
}

const deleted = async (req, res, next) => {
    if (await pm.modifyAdmin(req)) {
        res.json(await order.deleted(req));
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