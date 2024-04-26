const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const dt = require(__dirname + "../../modules/date-tools");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Mem {
    constructor (type, req) {
        this.type = type;
        this.mem_id = req.body.mem_id;
        this.chinese_name = req.body.chinese_name;
        this.account = req.body.account;
        this.password = req.body.password;
        this.first_name = req.body.first_name;
        this.last_name = req.body.last_name;
        this.purchase_date = req.body.purchase_date;
        this.auth = req.body.auth;
        this.comment = req.body.comment;
        this.active_date = req.body.active_date;
        this.user_type = req.body.user_type;
        this.id_num = req.body.id_num;
        this.phone_num = req.body.phone_num;
        this.email = req.body.email;
        this.address = req.body.address;
        this.status = req.body.status;
        this.school = req.body.school;
        this.major = req.body.major;
        this.grade = req.body.grade;
        this.industry = req.body.industry;
        this.company_name = req.body.company_name;
        this.info_way = req.body.info_way;
 
        this.update = async () => {
            try{
                if (this.type === 'update'){
                    if (this.mem_id > 0){
                        let model = new dbe.DBModel('mem');
                        if (v.exists(this.chinese_name)) model.add('chinese_name', this.chinese_name); 
                        if (v.exists(this.first_name)) model.add('first_name', this.first_name);
                        if (v.exists(this.last_name)) model.add('last_name', this.last_name);
                        if (v.exists(this.auth)) model.add('auth', this.auth);
                        if (v.exists(this.comment)) model.add('comment', this.comment);
                        if (v.exists(this.active_date, false)) model.add('active_date', this.active_date);
                        if (v.exists(this.user_type)) model.add('user_type', this.user_type);
                        if (v.exists(this.id_num)) model.add('id_num', this.id_num);
                        if (v.exists(this.phone_num)) model.add('phone_num', this.phone_num);
                        if (v.exists(this.email)) model.add('email', this.email);
                        if (v.exists(this.address)) model.add('address', this.address);
                        if (v.exists(this.status)) model.add('status', this.status);
                        if (v.exists(this.school)) model.add('school', this.school);
                        if (v.exists(this.major)) model.add('major', this.major);
                        if (v.exists(this.grade)) model.add('grade', this.grade);
                        if (v.exists(this.industry)) model.add('industry', this.industry);
                        if (v.exists(this.company_name)) model.add('company_name', this.company_name);
                        if (v.exists(this.info_way)) model.add('info_way', this.info_way);
                        if (v.exists(this.mem_id)) model.addWhere("mem_id", "=", this.mem_id);
                        return await model.update();
                    } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
                }
                else return new dbe.QueryResult([{}], "Command type error.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                if (this.type === 'insert'){
                    if (!this.mem_id){
                        let model = new dbe.DBModel('mem');
                        if (v.exists(this.chinese_name)) model.add('chinese_name', this.chinese_name);
                        if (v.exists(this.account, false)) model.add('account', this.account);
                        if (v.exists(this.password, false)) model.add('password', await enc.sha256(this.password)); 
                        if (v.exists(this.first_name)) model.add('first_name', this.first_name);
                        if (v.exists(this.last_name)) model.add('last_name', this.last_name);
                        if (v.exists(this.purchase_date, false)) model.add('purchase_date', this.purchase_date);
                        if (v.exists(this.auth)) model.add('auth', this.auth);
                        if (v.exists(this.comment)) model.add('comment', this.comment);
                        if (v.exists(this.active_date, false)) model.add('active_date', this.active_date);
                        if (v.exists(this.user_type)) model.add('user_type', this.user_type);
                        if (v.exists(this.id_num)) model.add('id_num', this.id_num);
                        if (v.exists(this.phone_num)) model.add('phone_num', this.phone_num);
                        if (v.exists(this.email)) model.add('email', this.email);
                        if (v.exists(this.address)) model.add('address', this.address);
                        if (v.exists(this.status)) model.add('status', this.status);
                        if (v.exists(this.school)) model.add('school', this.school);
                        if (v.exists(this.major)) model.add('major', this.major);
                        if (v.exists(this.grade)) model.add('grade', this.grade);
                        if (v.exists(this.industry)) model.add('industry', this.industry);
                        if (v.exists(this.company_name)) model.add('company_name', this.company_name);
                        if (v.exists(this.info_way)) model.add('info_way', this.info_way);
                        return await model.insert();
                    } else return new dbe.QueryResult([{}], "Already login.", 422);
                }
                else return new dbe.QueryResult([{}], "Command type error.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }
    }
}


const duplicateValid = async (account = null, email = null) => {
    try {
        if (account){
            const accountValid = await dbe.search("SELECT * FROM `mem` WHERE `account` = ?", account);
            if (Object.keys(accountValid[0]).length) return "Account is already used.";
        } else if (email){
            const emailValid = await dbe.search("SELECT * FROM `mem` WHERE `email` = ?", email);
            if (Object.keys(emailValid[0].keys).length) return "Email is already used.";
        } 
    } catch (error) {
        return error;
    }
    return "";
}

const register = async (req, res, next) => {
    const model = new Mem('insert', req);
    if (req.body.password === req.body.repassword) {
        const validResult = await duplicateValid(model.account, model.email);
        if(validResult) {
            res.json(new dbe.QueryResult([{}], validResult, 422));
        } else {
            const result = await model.insert();
            //console.log(result);
            res.json(new dbe.QueryResult(result.data[1], "", result.status));
        }
    } else {
        res.json(new dbe.QueryResult([{}], "Passwords are inconsistent.", 422));
    }
}

const loginValidator = async(account, password) => {
    const sqlAccount = "SELECT * FROM `mem` WHERE `account` = ?;";
    const paramsAccount = [account];
    const resultAccount = await dbe.search(sqlAccount, paramsAccount);

    if (!Object.keys(resultAccount[0]).length)
        return new dbe.QueryResult(resultAccount[0], "Account not found.", Object.keys(resultAccount[0]).length ? 200 : 404);

    const sql = "SELECT * FROM `mem` WHERE `account` = ? AND `password` = ?;";
    const params = [account, await enc.sha256(password)];
    const result = await dbe.search(sql, params);
    return new dbe.QueryResult(result[0], "", Object.keys(result[0]).length ? 200 : 404);
}

const get = async (id) => {
    const sql = 'SELECT * FROM `mem` WHERE `mem_id` = ?;';
    const param = [id];
    return await dbe.search(sql, param);
}

const getAll = async () => {
    const sql = 'SELECT * FROM `mem` ORDER BY `mem_id`;';
    return await dbe.search(sql);
}

const update = async (req) => {
    return await new Mem('update', req).update();
}

const resetPassword = async (req) => {
    try {
        const { mem_id, oldPassword, newPassword, repassword } = req.body;
        if (newPassword !== repassword) return new dbe.QueryResult([{}], "Passwords are inconsistent.", 422);
        const sql = "UPDATE `mem` SET `password` = ? WHERE `mem_id` = ? AND `password` = ?;";
        const params = [await enc.sha256(newPassword), mem_id, await enc.sha256(oldPassword)];
        const result = await dbe.transaction(sql, params);
        if (result[1][0].affectedRows === 0) {
            return new dbe.QueryResult([{}], "Old password is not match.", 422);
        }
        return new dbe.QueryResult(result, "", 200);
    } catch (error) {
        return new dbe.QueryResult([{}], error, 403);
    }
}

const changeStatus = async (req) => {
    const sql = "UPDATE `mem` SET `status` = ? WHERE `teacher_id` = ?;";
    const params = [req.body.status, req.body.mem_id];
    const result = await dbe.transaction(sql, params);
    if (result[1][0].affectedRows === 0) {
        return new dbe.QueryResult([{}], "Nothing to changed.", 422);
    }
    return new dbe.QueryResult(result, "", 200);
}

const deleted = async (req) => {
    const sql = "DELETE FROM `mem` WHERE `mem_id` = ?;";
    const params = [req.body.mem_id];
    const result = await dbe.transaction(sql, params);
    if (result[1][0].affectedRows === 0) {
        return new dbe.QueryResult([{}], "Nothing to deleted.", 422);
    }
    return new dbe.QueryResult(result, "", 200);
}



module.exports = {
    register,
    resetPassword,
    loginValidator,
    update,
    get,
    getAll,
    deleted,
    changeStatus,
}

