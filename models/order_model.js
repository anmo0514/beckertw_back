const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");

class Order {
    constructor (req) {
        this.order_id = req.body.order_id;
        this.mem_id = req.body.mem_id;
        this.product_id = req.body.product_id;
        this.discount_id = req.body.discount_id;   
        this.mou_id = req.body.mou_id;   
        this.partner_id = req.body.partner_id;   
        this.total_price = req.body.total_price;   
        this.software_ex = req.body.software_ex;  
        this.extension = req.body.extension; 
        this.memo = req.body.memo;  

        if (['GET', 'DELETE'].includes(req.method)){
            this.order_id = req.params.order_id;   
        }
        
 
        this.update = async () => {
            try{
                if (this.order_id > 0){
                    let model = new dbe.DBModel('order');
                    if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                    if (v.exists(this.product_id)) model.add('product_id', this.product_id); 
                    if (v.exists(this.discount_id)) model.add('discount_id', this.discount_id);
                    if (v.exists(this.mou_id)) model.add('mou_id', this.mou_id);
                    if (v.exists(this.partner_id)) model.add('partner_id', this.partner_id);
                    if (v.exists(this.total_price)) model.add('total_price', this.total_price);
                    if (v.exists(this.software_ex)) model.add('software_ex', toDatetimeString(this.software_ex));
                    if (v.exists(this.extension)) model.add('extension', this.extension);
                    if (v.exists(this.memo)) model.add('memo', this.memo);
                    if (v.exists(this.order_id)) model.addWhere("order_id", "=", this.order_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('order');
                if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                if (v.exists(this.product_id)) model.add('product_id', this.product_id); 
                if (v.exists(this.discount_id)) model.add('discount_id', this.discount_id);
                if (v.exists(this.mou_id)) model.add('mou_id', this.mou_id);
                if (v.exists(this.partner_id)) model.add('partner_id', this.partner_id);
                if (v.exists(this.total_price)) model.add('total_price', this.total_price);
                if (v.exists(this.software_ex)) model.add('software_ex', toDatetimeString(this.software_ex));
                if (v.exists(this.extension)) model.add('extension', this.extension);
                if (v.exists(this.memo)) model.add('memo', this.memo);
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('order');
                return await model.get('order_id', this.order_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('order');
                return await model.delete('order_id', this.order_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('order');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Order(req).insert();
}

const get = async (req) => {
    return await new Order(req).get();
}

const getAll = async (req) => {
    return await new Order(req).getAll();
}

const update = async (req) => {
    return await new Order(req).update();
}

const deleted = async (req) => {
    return await new Order(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}