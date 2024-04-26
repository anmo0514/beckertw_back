require("dotenv").config();
const jwt = require("jsonwebtoken");
const tools = require(__dirname + "../../modules/tools");
const { toDateString, toDatetimeString } = require(__dirname + "../../modules/date-tools.js");


const verifyLoginStatus = async (req) => {
    let token;
    if (req.session.token) token = req.session.token;
    else if (req.headers['token']) token = req.headers['token'];
    else if (req.signedCookies.token) token = req.signedCookies.token;
    if (token) return await verifyToken(token);
    return "";
}

const verifyToken = async (token) => {
    /**
     * Verify user login token is effect or not.
     * @param {string} token Request header token, if login successful will get one and expired after 10 hours.
     * @returns {string} return User id or empty string.
     */
    if (token) {
        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return "";
            else if (decoded.exp <= Math.floor(Date.now() / 1000)) return "";
            else return decoded.data;
        });
    } 
    return "";
}

const verifyString = (string, pattern, min, max, flag) => {
    /**
     * Only verify whether the string conforms to the rules and length
     * @param {string} string The string which will be test.
     * @param {RegExp} pattern Regex string, the verify rules.
     * @param {int} min String min length, default = 0.
     * @param {int} max String max length, default = 0. (if 0 will ignore max limit)
     * @param {string} flag Regex flags, use small case, default is m (multi-line) and g (global), ex. "mg".
     * @returns {boolean} Return regex test result.
     */
    try {
        if (emptyOrNull(min) || emptyOrNull(max)) throw new Error ("Error with wrong min, max data type.");
        if (!(/^([0]|([1-9][0-9]*))$/mg.test(min))) throw new Error ("Error with wrong min data format.");
        if (!(/^([0]|([1-9][0-9]*))$/mg.test(max))) throw new Error ("Error with wrong max data format.");
        if (!emptyOrNull(flag)){
            if (!/^([dgimsuvyDGIMSUVY]+)$/mg.test(flag)) throw new Error ("Error with wrong flag data format.");
            flag = (flag + "").toLowerCase();
        } else flag = "";
        if (string.length < min && min > 0) return false;
        if (string.length > max && max > 0) return false;
        if (min > max && max > 0) throw new Error ("Regex min char should small or equal max char.");
        return new RegExp(pattern, flag).test(string);
    } catch (error) {
        console.error(error);
        return false;
    }
}

const emptyOrNull = (s) => {
    try{
        if(!s && s !== 0){
            return true;
        } else if (s === NaN){
            return true;
        } else if (s === null){
            return true;
        } else if ((s + "").trim().length === 0){
            return true;
        } 
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const exists = (s, allowEmpty = true) => {
    try {
        if (allowEmpty) {
            if (s || s === "") return true;
        } else {
            if (s) return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const stringAbleOrArray = (obj) => {
    /**
     * If obj is string able obj, return true
     * If obj is array, return false
     * @returns {boolean} If obj is string able obj, return true else if is array, return false.
     */
    try{
        tools.getDimensions(obj);
        return false;
    } catch {
        return true;
    }
} 

const isDate = (obj) => {
    try {
        if (!isNaN(new Date(obj))) return true;
        return false;
    } catch (err) {
        return false;
    }
}

const integer = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^([0]|[\-]?[1-9][0-9]*)$/, min, max, flag);
}

const number = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^[\-]?([0]|[1-9][0-9]*(\.[0-9]+)?)$/, min, max, flag);
}

const email = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^[a-zA-z0-9\-\.]+\@[a-zA-z0-9\-]+(\.[a-zA-z0-9\-]+){0,2}$/, min, max, flag);
}

const nonSymbolString = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^[^\`\~\!\@\#\$\%\^\&\*\(\)\_\-\=\+\'\"\:\|\;\?\>\<\.\,\/\\\[\]]*$/, min, max, flag);
}

const commonString = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^[^\`\~\^\|\>\<\/\[\]]*$/, min, max, flag);
}

const identiferString = (string, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, /^[^\`\~\!\@\#\$\%\^\*\(\)\_\=\+\"\:\|\;\?\>\<\/\\\[\]]*$/, min, max, flag);
}

const regexString = (string, pattern, min = 0, max = 0, flag = "mg") => {
    return verifyString(string, pattern, min, max, flag);
}


module.exports = {
    verifyLoginStatus,
    verifyToken,
    emptyOrNull,
    exists,
    stringAbleOrArray,
    nonSymbolString,
    isDate,
    commonString,
    identiferString,
    regexString,
    integer,
    number,
    email,
}