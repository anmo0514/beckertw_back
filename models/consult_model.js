const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Consult {
    constructor (req) {
        this.consult_id = req.body.consult_id;
        this.mem_id = req.body.mem_id;
        this.first_record = req.body.first_record;
        this.sec_record = req.body.sec_record;   
        this.third_record = req.body.third_record;   
        this.pass = req.body.pass;  
        this.memo = req.body.memo;  

        if (['GET', 'DELETE'].includes(req.method)){
            this.consult_id = req.params.consult_id;   
        }
 
        this.update = async () => {
            try{
                if (this.consult_id > 0){
                    let model = new dbe.DBModel('consult');
                    if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                    if (v.exists(this.first_record)) model.add('first_record', this.first_record); 
                    if (v.exists(this.sec_record)) model.add('sec_record', this.sec_record);
                    if (v.exists(this.third_record)) model.add('third_record', this.third_record);
                    if (v.exists(this.pass)) model.add('pass', this.pass);
                    if (v.exists(this.memo)) model.add('memo', this.memo);
                    if (v.exists(this.consult_id)) model.addWhere("consult_id", "=", this.consult_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('consult');
                if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                if (v.exists(this.first_record)) model.add('first_record', this.first_record); 
                if (v.exists(this.sec_record)) model.add('sec_record', this.sec_record);
                if (v.exists(this.third_record)) model.add('third_record', this.third_record);
                if (v.exists(this.pass)) model.add('pass', this.pass);
                if (v.exists(this.memo)) model.add('memo', this.memo);
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('consult');
                return await model.get('consult_id', this.consult_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('consult');
                return await model.delete('consult_id', this.consult_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('consult');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Consult(req).insert();
}

const get = async (req) => {
    return await new Consult(req).get();
}

const getAll = async (req) => {
    return await new Consult(req).getAll();
}

const update = async (req) => {
    return await new Consult(req).update();
}

const deleted = async (req) => {
    return await new Consult(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}