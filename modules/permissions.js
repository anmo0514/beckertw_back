const permissions = ['member', 'teacher', 'admin'];
const v = require(__dirname + "../../modules/verify");

const isMember = async (req) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'member') return data;
    }
    return "";
}

const isTeacher = async (req) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'teacher') return data;
    }
    return "";
}

const isAdmin = async (req) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'admin') return data;
    }
    return "";
}

const modifyMember = async (req, targetId) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'member'){
             return targetId === data.id;
        } else if (data.type === 'teacher') {
            return true;
        } else if (data.type === 'admin') {
            return true;
        }
    }
    return false;
}

const modifyTeacher = async (req, targetId) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'member'){
             return false;
        } else if (data.type === 'teacher') {
            return targetId === data.id;
        } else if (data.type === 'admin') {
            return true;
        }
    }
    return false;
}

const modifyAdmin = async (req) => {
    const data = await v.verifyLoginStatus(req);
    if (data){
        if (data.type === 'member'){
             return false;
        } else if (data.type === 'teacher') {
            return false;
        } else if (data.type === 'admin') {
            return true;
        }
    }
    return false;
}


module.exports = {
    isMember,
    isTeacher,
    isAdmin,
    modifyMember,
    modifyTeacher,
    modifyAdmin,
}