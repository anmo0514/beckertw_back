const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");
const {toDatetimeString} = require(__dirname + "../../modules/date-tools");

class Teacher {
    constructor (type, req) {
        this.type = type;
        this.teacher_id = req.body.teacher_id;
        this.name = req.body.name;
        this.email = req.body.email;
        this.password = req.body.password;
        this.subject = req.body.subject;
        this.xtype = req.body.xtype;
        this.subject2 = req.body.subject2;
        this.xtype2 = req.body.xtype2;
        this.status = req.body.status;
        
 
        this.update = async () => {
            try{
                if (this.type === 'update'){
                    if (this.teacher_id > 0){
                        let model = new dbe.DBModel('teacher');
                        if (v.exists(this.name)) model.add('name', this.name); 
                        if (v.exists(this.password)) {
                            let sqlPassword = "SELECT * FROM `teacher` WHERE `teacher_id` = " + (this.teacher_id + '');
                            const validPassword = await dbe.search(sqlPassword, null, true);
                            if (validPassword) {
                                if(validPassword[0].password !== this.password){
                                    const newPassword = await enc.sha256(this.password);
                                    if(validPassword[0].password !== newPassword) {
                                        model.add('password', newPassword);
                                    }
                                }
                            }
                        }
                        if (v.exists(this.subject)) model.add('subject', this.subject);
                        if (v.exists(this.xtype)) model.add('xtype', this.xtype);
                        if (v.exists(this.subject2)) model.add('subject2', this.subject2);
                        if (v.exists(this.xtype2)) model.add('xtype2', this.xtype2);
                        if (v.exists(this.status)) model.add('status', this.status);
                        if (this.status + "" === "0"){
                            model.add('disabletime', toDatetimeString(Date.now()));
                            
                        }
                        if (v.exists(this.teacher_id)) model.addWhere("teacher_id", "=", this.teacher_id);
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
                    if (!this.teacher_id){
                        let model = new dbe.DBModel('teacher');
                        if (v.exists(this.name)) model.add('name', this.name); 
                        if (v.exists(this.email)) model.add('email', this.email);
                        if (v.exists(this.password)) model.add('password', await enc.sha256(this.password));
                        if (v.exists(this.subject)) model.add('subject', this.subject);
                        if (v.exists(this.xtype)) model.add('xtype', this.xtype);
                        if (v.exists(this.subject2)) model.add('subject2', this.subject2);
                        if (v.exists(this.xtype2)) model.add('xtype2', this.xtype2);
                        if (v.exists(this.status)) model.add('status', this.status);
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

const loginValidator = async(email, password) => {
    const sqlEmail = "SELECT * FROM `teacher` WHERE `email` = ?;";
    const paramsEmail = [email];
    const resultEmail = await dbe.search(sqlEmail, paramsEmail);
    
    if (!Object.keys(resultEmail[0]).length)
        return new dbe.QueryResult(resultEmail[0], "Account not found.", Object.keys(resultEmail[0]).length ? 200 : 404);

    const sql = "SELECT * FROM `teacher` WHERE `email` = ? AND `password` = ? AND `status` = 1;";
    const params = [email, await enc.sha256(password)];
    const result = await dbe.search(sql, params);
    return new dbe.QueryResult(result[0], "", Object.keys(result[0]).length ? 200 : 404);
}

const duplicateValid = async (email = null) => {
    try {
        if (email){
            const emailValid = await dbe.search("SELECT * FROM `teacher` WHERE `email` = ?", email);
            if (Object.keys(emailValid[0]).length) return "Account is already used.";
        } 
    } catch (error) {
        return error;
    }
    return "";
}

const register = async (req, res, next) => {
    const model = new Teacher('insert', req);
    const validResult = await duplicateValid(model.email);
    if(validResult) {
        res.json(new dbe.QueryResult([{}], validResult, 422));
    } else {
        const result = await model.insert();
        //console.log(result);
        res.json(new dbe.QueryResult(result.data[1], "", result.status));
    }
    /*
    if (req.body.password === req.body.repassword) {
  
    } else {
        res.json(new dbe.QueryResult([{}], "Passwords are inconsistent", 422));
    }
    */
}

const resetPassword = async (req) => {
    try {
        const { teacher_id, oldPassword, newPassword, repassword } = req.body;
        if (newPassword !== repassword) return new dbe.QueryResult([{}], "Passwords are inconsistent.", 422);
        const sql = "UPDATE `teacher` SET `password` = ? WHERE `teacher_id` = ? AND `password` = ?";
        const params = [await enc.sha256(newPassword), teacher_id, await enc.sha256(oldPassword)];
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
    const sql = 'SELECT * FROM `teacher` WHERE `teacher_id` = ?;';
    const param = [id];
    return await dbe.search(sql, param);
}

const getAll = async () => {
    const sql = 'SELECT * FROM `teacher` ORDER BY `status` DESC, `teacher_id`;';
    return await dbe.search(sql);
}

const update = async (req) => {
    return await new Teacher('update', req).update();
}

const changeStatus = async (req) => {
    let sql = "";
    if(req.body.status === 0) sql = "UPDATE `teacher` SET `status` = ?, `disabletime` = NOW() WHERE `teacher_id` = ?;";
    else if(req.body.status) sql = "UPDATE `teacher` SET `status` = ?, `disabletime` = NULL WHERE `teacher_id` = ?;";
    const params = [req.body.status, req.body.teacher_id];
    const result = await dbe.transaction(sql, params);
    if (result[1][0].affectedRows === 0) {
        return new dbe.QueryResult([{}], "Nothing to changed.", 422);
    }
    return new dbe.QueryResult(result, "", 200);
}

const deleted = async (req) => {
    const sql = "DELETE FROM `teacher` WHERE `teacher_id` = ?;";
    const params = [req.body.teacher_id];
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
    changeStatus,
}