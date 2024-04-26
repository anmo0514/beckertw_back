const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Course {
    constructor (req) {
        this.course_id = req.body.course_id;
        this.name = req.body.name;
        this.parent_id = req.body.parent_id;

        if (['GET', 'DELETE'].includes(req.method)){
            this.course_id = req.params.course_id;   
        }
        
 
        this.update = async () => {
            try{
                if (this.course_id > 0){
                    let model = new dbe.DBModel('course');
                    if (v.exists(this.name)) model.add('name', this.name); 
                    if (v.exists(this.product_id)) model.add('product_id', this.product_id); 
                    if (v.exists(this.course_id)) model.addWhere("course_id", "=", this.course_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('course');
                if (v.exists(this.name)) model.add('name', this.name); 
                if (v.exists(this.product_id)) model.add('product_id', this.product_id); 
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('course');
                return await model.get('course_id', this.course_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('course');
                return await model.delete('course_id', this.course_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('course');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Course(req).insert();
}

const get = async (req) => {
    return await new Course(req).get();
}

const getAll = async (req) => {
    return await new Course(req).getAll();
}

const update = async (req) => {
    return await new Course(req).update();
}

const deleted = async (req) => {
    return await new Course(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}