const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Product {
    constructor (req) {
        this.product_id = req.body.product_id;
        this.name = req.body.name;
        this.parent_id = req.body.parent_id;
        this.price = req.body.price;   
        this.status = req.body.status;   

        if (['GET', 'DELETE'].includes(req.method)){
            this.product_id = req.params.product_id;   
        }
        
 
        this.update = async () => {
            try{
                if (this.product_id > 0){
                    let model = new dbe.DBModel('product');
                    if (v.exists(this.name)) model.add('name', this.name); 
                    if (v.exists(this.parent_id)) model.add('parent_id', this.parent_id); 
                    if (v.exists(this.price)) model.add('price', this.price);
                    if (v.exists(this.status)) model.add('status', this.status);
                    if (v.exists(this.product_id)) model.addWhere("product_id", "=", this.product_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('product');
                if (v.exists(this.name)) model.add('name', this.name); 
                if (v.exists(this.parent_id)) model.add('parent_id', this.parent_id); 
                if (v.exists(this.price)) model.add('price', this.price);
                if (v.exists(this.status)) model.add('status', this.status);
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('product');
                return await model.get('product_id', this.product_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('product');
                return await model.delete('product_id', this.product_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('product');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Product(req).insert();
}

const get = async (req) => {
    return await new Product(req).get();
}

const getAll = async (req) => {
    return await new Product(req).getAll();
}

const update = async (req) => {
    return await new Product(req).update();
}

const deleted = async (req) => {
    return await new Product(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}