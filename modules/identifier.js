require("dotenv").config();
const enc = require(__dirname + "../../modules/encryption");
const dt = require(__dirname + "../../modules/date-tools");
const dbe = require(__dirname + "../../modules/mysql-excute");

const OPT = async (user_id, functionName) => {
    const sql = 'INSERT INTO `opt` (user_id, function, opt, expired) VALUES (?, ?, ?, ?);';
    const expiredTime = dt.toDatetimeStringAdd15Mins(Date.Now());
    const opt = enc.sha256((user_id + "") + functionName + expiredTime);
    const params = [user_id, functionName, opt, expiredTime];
    const result = await dbe.translation(sql, params);
    return new dbe.QueryResult(result);
}

const user_id = (identitfyObject=null) => {
    return -1;
}

const user_type = (identitfyObject=null) => {
    return "test";
}

module.exports = {
    OPT,
    user_id,
    user_type,
}