const dbe = require(__dirname + "../../modules/mysql-excute");
const enc = require(__dirname + "../../modules/encryption");
const v = require(__dirname + "../../modules/verify");
const l = require(__dirname + "../../modules/logs");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");

class QA {
    constructor (req) {
        this.qa_id = req.body.qa_id;
        this.mem_id = req.body.mem_id;
        this.subject = req.body.subject;
        this.xtype = req.body.xtype;   
        this.cpa = req.body.cpa;   
        this.chapter = req.body.chapter;  
        this.sim_set = req.body.sim_set;  
        this.question = req.body.question;  
        this.moc_set = req.body.moc_set;  
        this.testlet = req.body.testlet;  
        this.moc = req.body.moc;  
        this.my_answer = req.body.my_answer;  
        this.my_question = req.body.my_question;  
        this.teacher_id = req.body.teacher_id;  
        this.reply_status = req.body.reply_status;  
        this.reply = req.body.reply;  
        this.draft = req.body.draft;  
        this.deny_reason = req.body.deny_reason;  
        this.create_date = req.body.create_date;  
        this.reply_date = req.body.reply_date;  

        if (['GET', 'DELETE'].includes(req.method)){
            this.qa_id = req.params.qa_id;   
        }
 
        this.update = async () => {
            try{
                if (this.qa_id > 0){
                    let model = new dbe.DBModel('qa');
                    if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                    if (v.exists(this.subject)) model.add('subject', this.subject); 
                    if (v.exists(this.xtype)) model.add('xtype', this.xtype);
                    if (v.exists(this.cpa)) model.add('cpa', this.cpa);
                    if (v.exists(this.chapter)) model.add('chapter', this.chapter);
                    if (v.exists(this.sim_set)) model.add('sim_set', this.sim_set);
                    if (v.exists(this.question)) model.add('question', this.question);
                    if (v.exists(this.moc_set)) model.add('moc_set', this.moc_set);
                    if (v.exists(this.testlet)) model.add('testlet', this.testlet);
                    if (v.exists(this.moc)) model.add('moc', this.moc);
                    if (v.exists(this.my_answer)) model.add('my_answer', this.my_answer);
                    if (v.exists(this.my_question)) model.add('my_question', this.my_question);
                    if (v.exists(this.teacher_id)) model.add('teacher_id', this.teacher_id);
                    if (v.exists(this.reply_status)) model.add('reply_status', this.reply_status);
                    if (v.exists(this.reply)) model.add('reply', this.reply);
                    if (v.exists(this.draft)) model.add('draft', this.draft);
                    if (v.exists(this.deny_reason)) model.add('deny_reason', this.deny_reason);
                    if (v.exists(this.reply_date)) model.add('reply_date', toDatetimeString(this.reply_date));
                    if (v.exists(this.qa_id)) model.addWhere("qa_id", "=", this.qa_id);
                    return await model.update();
                } else return new dbe.QueryResult([{}], "Required identitfy number.", 422);
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        } 

        this.insert = async () => {
            try{
                let model = new dbe.DBModel('qa');
                if (v.exists(this.mem_id)) model.add('mem_id', this.mem_id); 
                    if (v.exists(this.subject)) model.add('subject', this.subject); 
                    if (v.exists(this.xtype)) model.add('xtype', this.xtype);
                    if (v.exists(this.cpa)) model.add('cpa', this.cpa);
                    if (v.exists(this.chapter)) model.add('chapter', this.chapter);
                    if (v.exists(this.sim_set)) model.add('sim_set', this.sim_set);
                    if (v.exists(this.question)) model.add('question', this.question);
                    if (v.exists(this.moc_set)) model.add('moc_set', this.moc_set);
                    if (v.exists(this.testlet)) model.add('testlet', this.testlet);
                    if (v.exists(this.moc)) model.add('moc', this.moc);
                    if (v.exists(this.my_answer)) model.add('my_answer', this.my_answer);
                    if (v.exists(this.my_question)) model.add('my_question', this.my_question);
                    if (v.exists(this.teacher_id)) model.add('teacher_id', this.teacher_id);
                    if (v.exists(this.reply_status)) model.add('reply_status', this.reply_status);
                    if (v.exists(this.reply)) model.add('reply', this.reply);
                    if (v.exists(this.draft)) model.add('draft', this.draft);
                    if (v.exists(this.deny_reason)) model.add('deny_reason', this.deny_reason);
                    model.add('create_date', toDatetimeString(Date.now()));
                return await model.insert();
            } catch (err) {
                l.cError(err);
                return new dbe.QueryResult([{}], err, 403);
            }
        }

        this.get = async () => {
            try{
                let model = new dbe.DBModel('qa');
                return await model.get('qa_id', this.qa_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.delete = async () => {
            try{
                let model = new dbe.DBModel('qa');
                return await model.delete('qa_id', this.qa_id);
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }

        this.getAll = async () => {
            try{
                let model = new dbe.DBModel('qa');
                return await model.getAll();
            } catch (error) {
                return new dbe.QueryResult([{}], error, 404);
            }
        }
    }
}

const insert = async (req) => {
    return await new QA(req).insert();
}

const get = async (req) => {
    return await new QA(req).get();
}

const getAll = async (req) => {
    return await new QA(req).getAll();
}

const update = async (req) => {
    return await new QA(req).update();
}

const deleted = async (req) => {
    return await new QA(req).delete();
}


module.exports = {
    insert,
    get,
    getAll,
    update,
    deleted,
}