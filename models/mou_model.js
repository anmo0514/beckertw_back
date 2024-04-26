const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Mou {
    constructor (req) {
        this.mou_id = req.body.mou_id;
        this.name = req.body.name;
        this.discount = req.body.discount;
        this.status = req.body.status;   
        this.memo = req.body.memo;   

        if (['GET', 'DELETE'].includes(req.method)){
            this.mou_id = req.params.mou_id;   
        }
 
        this.update = async () => {
            try{
                if (this.mou_id > 0){
                    let model = new dbe.DBModel('mou');
                    if (v.exists(this.name)) model.add('name', this.name); 
                    if (v.exists(this.discount)) model.add('discount', this.discount);
                    if (v.exists(this.status)) model.add('status', this.status);
                    if (v.exists(this.memo)) model.add('memo', this.memo);
                    if (v.exists(this.mou_id)) model.addWhere("mou_id", "=", this.mou_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('mou');
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
                let model = new dbe.DBModel('mou');
                return await model.get('mou_id', this.mou_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('mou');
                return await model.delete('mou_id', this.mou_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('mou');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Mou(req).insert();
}

const get = async (req) => {
    return await new Mou(req).get();
}

const getAll = async (req) => {
    return await new Mou(req).getAll();
}

const update = async (req) => {
    return await new Mou(req).update();
}

const deleted = async (req) => {
    return await new Mou(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}