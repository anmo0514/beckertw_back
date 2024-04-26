const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Partner {
    constructor (req) {
        this.partner_id = req.body.partner_id;
        this.name = req.body.name;
        this.discount = req.body.discount;
        this.status = req.body.status;   
        this.memo = req.body.memo;    

        if (['GET', 'DELETE'].includes(req.method)){
            this.partner_id = req.params.partner_id;   
        }
 
        this.update = async () => {
            try{
                if (this.partner_id > 0){
                    let model = new dbe.DBModel('partner');
                    if (v.exists(this.name)) model.add('name', this.name); 
                    if (v.exists(this.discount)) model.add('discount', this.discount); 
                    if (v.exists(this.status)) model.add('status', this.status);
                    if (v.exists(this.memo)) model.add('memo', this.memo);
                    if (v.exists(this.partner_id)) model.addWhere("partner_id", "=", this.partner_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('partner');
                if (v.exists(this.name)) model.add('name', this.name); 
                if (v.exists(this.discount)) model.add('discount', this.discount); 
                if (v.exists(this.status)) model.add('status', this.status);
                if (v.exists(this.memo)) model.add('memo', this.memo);
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('partner');
                return await model.get('partner_id', this.partner_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('partner');
                return await model.delete('partner_id', this.partner_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('partner');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Partner(req).insert();
}

const get = async (req) => {
    return await new Partner(req).get();
}

const getAll = async (req) => {
    return await new Partner(req).getAll();
}

const update = async (req) => {
    return await new Partner(req).update();
}

const deleted = async (req) => {
    return await new Partner(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}