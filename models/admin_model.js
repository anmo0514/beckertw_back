const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Admin {
    constructor (type, req) {
        this.type = type;
        this.admin_id = req.body.admin_id;
        this.name = req.body.name;
        this.account = req.body.account;
        this.password = req.body.password;    
        this.status = req.body.status;      
        //this.settint_type = req.body.settint_type;      
 
        this.update = async () => {
            try{
                if (this.type === 'update'){
                    if (this.admin_id > 0){
                        let model = new dbe.DBModel('manager');
                        if (v.exists(this.name)) model.add('name', this.name); 
                        if (v.exists(this.status)) model.add('status', this.status); 
                        //if (v.exists(this.settint_type)) model.add('settint_type', this.settint_type); 
                        //if (v.exists(this.account)) model.add('account', this.account);
                        //if (v.exists(this.password)) model.add('password', await enc.sha256(this.password));
                        if (v.exists(this.admin_id)) model.addWhere("admin_id", "=", this.admin_id);
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
                    if (!this.admin_id){
                        let model = new dbe.DBModel('manager');
                        if (v.exists(this.name)) model.add('name', this.name); 
                        if (v.exists(this.account)) model.add('account', this.account);
                        if (v.exists(this.password)) model.add('password', await enc.sha256(this.password));
                        if (v.exists(this.status)) model.add('status', this.status); 
                        //if (v.exists(this.settint_type)) model.add('settint_type', this.settint_type); 
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

const loginValidator = async(account, password) => {
    const sqlAccount = "SELECT * FROM `manager` WHERE `account` = ?;";
    const paramsAccount = [account];
    const resultAccount = await dbe.search(sqlAccount, paramsAccount);
    if (!Object.keys(resultAccount[0]).length)
        return new dbe.QueryResult(resultAccount[0], "Account not found.", Object.keys(resultAccount[0]).length ? 200 : 404);

    const sql = "SELECT * FROM `manager` WHERE `account` = ? AND `password` = ?;";
    const params = [account, await enc.sha256(password)];
    const result = await dbe.search(sql, params);
    return new dbe.QueryResult(result[0], "", Object.keys(result[0]).length ? 200 : 404);
}

const duplicateValid = async (account = null) => {
    try {
        if (account){
            const emailValid = await dbe.search("SELECT * FROM `manager` WHERE `account` = ?", account);
            if (Object.keys(emailValid[0]).length) return "Account is already used.";
        } 
    } catch (error) {
        return error;
    }
    return "";
}

const register = async (req, res, next) => {
    const model = new Admin('insert', req);
    if (req.body.password === req.body.repassword) {
        const validResult = await duplicateValid(model.account);
        if(validResult) {
            res.json(new dbe.QueryResult([{}], validResult, 422));
        } else {
            const result = await model.insert();
            //console.log(result);
            res.json(new dbe.QueryResult(result.data[1], "", result.status));
        }
    } else {
        res.json(new dbe.QueryResult([{}], "Passwords are inconsistent", 422));
    }
}

const resetPassword = async (req) => {
    try {
        const { admin_id, oldPassword, newPassword, repassword } = req.body;
        if (newPassword !== repassword) return new dbe.QueryResult([{}], "Passwords are inconsistent.", 422);
        const sql = "UPDATE `admin` SET `password` = ? WHERE `admin_id` = ? AND `password` = ?";
        const params = [await enc.sha256(newPassword), admin_id, await enc.sha256(oldPassword)];
        const result = await dbe.transaction(sql, params);
        if (result[1][0].affectedRows === 0) {
            return new dbe.QueryResult([{}], "Old password is not match.", 422);
        }
        return new dbe.QueryResult(result, "", 200);
        
    } catch (error) {
        return new dbe.QueryResult([{}], error, 403);
    }
}

const get = async (id) => {
    const sql = 'SELECT * FROM `manager` WHERE `admin_id` = ?;';
    const param = [id];
    return await dbe.search(sql, param);
}

const getAll = async () => {
    const sql = 'SELECT * FROM `manager` ORDER BY `admin_id`;';
    return await dbe.search(sql);
}

const update = async (req) => {
    return await new Admin('update', req).update();
}

const changeStatus = async (req) => {
    const sql = "UPDATE `manager` SET `status` = ? WHERE `admin_id` = ?;";
    const params = [req.body.status, req.body.admin_id];
    const result = await dbe.transaction(sql, params);
    if (result[1][0].affectedRows === 0) {
        return new dbe.QueryResult([{}], "Nothing to changed.", 422);
    }
    return new dbe.QueryResult(result, "", 200);
}

const deleted = async (req) => {
    const sql = "DELETE FROM `manager` WHERE `admin_id` = ?;";
    const params = [req.body.admin_id];
    const result = await dbe.transaction(sql, params);
    if (result[1][0].affectedRows === 0) {
        return new dbe.QueryResult([{}], "Nothing to deleted.", 422);
    }
    return new dbe.QueryResult(result, "", 200);
}


module.exports = {
    loginValidator,
    resetPassword,
    register,
    get,
    getAll,
    update,
    deleted,
    changeStatus
}