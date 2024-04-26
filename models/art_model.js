const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");

class Art {
    constructor (req) {
        this.art_id = req.body.art_id;
        this.cate_id = req.body.cate_id;
        this.art_type = req.body.art_type;
        this.is_top = req.body.is_top;   
        this.status = req.body.status;   
        this.privilege = req.body.privilege;  
        this.cate_status = req.body.cate_status;  
        this.title = req.body.title;  
        this.intro = req.body.intro;  
        this.content = req.body.content;  
        this.link = req.body.link;  
        this.target = req.body.target;  
        this.cover_1 = req.body.cover_1;  
        this.art_date = req.body.art_date;  
        this.disp_order = req.body.disp_order;  
        this.create_date = req.body.create_date;  
        this.update_date = req.body.update_date;  

        if (['GET', 'DELETE'].includes(req.method)){
            this.art_id = req.params.art_id;   
        }
 
        this.update = async () => {
            try{
                if (this.art_id > 0){
                    let model = new dbe.DBModel('art');
                    if (v.exists(this.cate_id)) model.add('cate_id', this.cate_id); 
                    if (v.exists(this.art_type)) model.add('art_type', this.art_type); 
                    if (v.exists(this.is_top)) model.add('is_top', this.is_top);
                    if (v.exists(this.status)) model.add('status', this.status);
                    if (v.exists(this.privilege)) model.add('privilege', this.privilege);
                    if (v.exists(this.cate_status)) model.add('cate_status', this.cate_status);
                    if (v.exists(this.title)) model.add('title', this.title);
                    if (v.exists(this.intro)) model.add('intro', this.intro);
                    if (v.exists(this.content)) model.add('content', this.content);
                    if (v.exists(this.link)) model.add('link', this.link);
                    if (v.exists(this.target)) model.add('target', this.target);
                    if (v.exists(this.cover_1)) model.add('cover_1', this.cover_1);
                    if (v.exists(this.art_date)) model.add('art_date', this.art_date);
                    if (v.exists(this.disp_order)) model.add('disp_order', this.disp_order);
                    model.add('update_date', toDatetimeString(Date.now()));
                    if (v.exists(this.art_id)) model.addWhere("art_id", "=", this.art_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('art');
                if (v.exists(this.cate_id)) model.add('cate_id', this.cate_id); 
                if (v.exists(this.art_type)) model.add('art_type', this.art_type); 
                if (v.exists(this.is_top)) model.add('is_top', this.is_top);
                if (v.exists(this.status)) model.add('status', this.status);
                if (v.exists(this.privilege)) model.add('privilege', this.privilege);
                if (v.exists(this.cate_status)) model.add('cate_status', this.cate_status);
                if (v.exists(this.title)) model.add('title', this.title);
                if (v.exists(this.intro)) model.add('intro', this.intro);
                if (v.exists(this.content)) model.add('content', this.content);
                if (v.exists(this.link)) model.add('link', this.link);
                if (v.exists(this.target)) model.add('target', this.target);
                if (v.exists(this.cover_1)) model.add('cover_1', this.cover_1);
                if (v.exists(this.art_date)) model.add('art_date', this.art_date);
                if (v.exists(this.disp_order)) model.add('disp_order', this.disp_order);
                model.add('create_date', toDatetimeString(Date.now()));
                model.add('update_date', toDatetimeString(Date.now()));
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('art');
                return await model.get('art_id', this.art_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('art');
                return await model.delete('art_id', this.art_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('art');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new Art(req).insert();
}

const get = async (req) => {
    return await new Art(req).get();
}

const getAll = async (req) => {
    return await new Art(req).getAll();
}

const update = async (req) => {
    return await new Art(req).update();
}

const deleted = async (req) => {
    return await new Art(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}