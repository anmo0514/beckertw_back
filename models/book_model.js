const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");

class Book {
    constructor (req) {
        this.receive_book_id = req.body.receive_book_id;
        this.order_id = req.body.order_id;
        this.course_id = req.body.course_id;
        this.final_review = req.body.final_review;
        this.flash_card = req.body.flash_card;
        this.status = req.body.status;

        if (['GET', 'DELETE'].includes(req.method)){
            this.receive_book_id = req.params.receive_book_id;   
        }
        
 
        this.update = async () => {
            try{
                if (this.receive_book_id > 0){
                    let model = new dbe.DBModel('book');
                    if (v.exists(this.order_id)) model.add('order_id', this.order_id); 
                    if (v.exists(this.course_id)) model.add('course_id', this.course_id); 
                    if (v.exists(this.final_review)) model.add('final_review', this.final_review); 
                    if (v.exists(this.flash_card)) model.add('flash_card', this.flash_card); 
                    if (v.exists(this.status)) model.add('status', this.status); 
                    if (v.exists(this.receive_book_id)) model.addWhere("receive_book_id", "=", this.receive_book_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('book');
                if (v.exists(this.order_id)) model.add('order_id', this.order_id); 
                if (v.exists(this.course_id)) model.add('course_id', this.course_id); 
                if (v.exists(this.final_review)) model.add('final_review', this.final_review); 
                if (v.exists(this.flash_card)) model.add('flash_card', this.flash_card); 
                if (v.exists(this.status)) model.add('status', this.status); 
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('book');
                return await model.get('receive_book_id', this.receive_book_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('book');
                return await model.delete('receive_book_id', this.receive_book_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('book');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Book(req).insert();
}

const get = async (req) => {
    return await new Book(req).get();
}

const getAll = async (req) => {
    return await new Book(req).getAll();
}

const update = async (req) => {
    return await new Book(req).update();
}

const deleted = async (req) => {
    return await new Book(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}