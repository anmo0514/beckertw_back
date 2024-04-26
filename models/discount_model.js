const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");

class Discount {
    constructor (req) {
        this.discount_id = req.body.discount_id;
        this.name = req.body.name;
        this.discount = req.body.discount;
        this.status = req.body.status;   
        this.due_date = req.body.due_date;   
        this.memo = req.body.memo;   

        if (['GET', 'DELETE'].includes(req.method)){
            this.discount_id = req.params.discount_id;   
        }
        
 
        this.update = async () => {
            try{
                if (this.discount_id > 0){
                    let model = new dbe.DBModel('discount');
                    if (v.exists(this.name)) model.add('name', this.name); 
                    if (v.exists(this.discount)) model.add('discount', this.discount); 
                    if (v.exists(this.status)) model.add('status', this.status);
                    if (v.exists(this.due_date)) model.add('due_date', toDatetimeString(this.due_date));
                    if (v.exists(this.memo)) model.add('memo', this.memo);
                    if (v.exists(this.discount_id)) model.addWhere("discount_id", "=", this.discount_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('discount');
                if (v.exists(this.name)) model.add('name', this.name); 
                if (v.exists(this.discount)) model.add('discount', this.discount); 
                if (v.exists(this.status)) model.add('status', this.status);
                if (v.exists(this.due_date)) model.add('due_date', toDatetimeString(this.due_date));
                if (v.exists(this.memo)) model.add('memo', this.memo);
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('discount');
                return await model.get('discount_id', this.discount_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('discount');
                return await model.delete('discount_id', this.discount_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('discount');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Discount(req).insert();
}

const get = async (req) => {
    return await new Discount(req).get();
}

const getAll = async (req) => {
    return await new Discount(req).getAll();
}

const update = async (req) => {
    return await new Discount(req).update();
}

const deleted = async (req) => {
    return await new Discount(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}