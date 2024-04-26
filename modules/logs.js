require("dotenv").config();

const db = require(__dirname + "../../modules/mysql-connect");
const verify = require(__dirname + "../../modules/verify");

class ErrorHelper {
    /**
     * Easy way to insert error message into database table (error_logs).
     * @param {int} user_id Current user id, it's mean which user cause the error, value -1 is super admin, 0 as system.
     * @param {string} user_type Current user type.
     * @param {string} function_name The error function name, record this will be easy to debug.
     * @param {string} error_discribe If anyone want to comment or classificate the raised error, write here.
     * @param {string} sql_query If try to run SQL query, record this will be easy to debug.
     * @param {array} sql_params If try to run SQL query, record this will be easy to debug.
     */
    constructor (user_id, user_type, function_name, error_log, error_discribe, sql_query, sql_params){
        try {
            this.user_id = user_id ? user_id : 0;
            this.user_type = user_type ? user_type.substring(0, 40) : 'unknow';
            this.function_name = function_name ? (function_name + "").substring(0, 400) : "unknow function";
            this.error_log = error_log ? (error_log + "") : "unknow log";
            this.error_discribe = error_discribe ? (error_discribe + "") : null;
            this.sql_query = sql_query ? (sql_query + "") : null;
            this.sql_params = sql_params ? (sql_params + "") : null;
        } catch (error) {
            this.user_id = user_id ? user_id : 0;
            this.user_type = user_type ? user_type.substring(0, 40) : 'unknow';
            this.function_name = "logs.ErrorHelper.constructor";
            this.error_log = error;
            this.error_discribe = null;
            this.sql_query = null;
            this.sql_params = null;
        }
        this.record = async () => {
            await dbLog(this.user_id, this.user_type, this.function_name, this.error_log, this.error_discribe, this.sql_query, this.sql_params);
        }
    }

}

const dbLog = async (user_id, user_type, function_name, error_log, error_discribe = null, sql_query = null, sql_params = null) => {
    /**
     * Insert error message into database table (error_logs).
     * @param {int} user_id Current user id, it's mean which user cause the error, value -1 is super admin, 0 as system.
     * @param {string} user_type Current user type.
     * @param {string} function_name The error function name, record this will be easy to debug.
     * @param {string} error_discribe If anyone want to comment or classificate the raised error, write here.
     * @param {string} sql_query If try to run SQL query, record this will be easy to debug.
     * @param {array} sql_params If try to run SQL query, record this will be easy to debug.
     */
    try{
        if (process.env.MODE === "test" || !verify.integer(user_id)) user_id = 0;
        if (verify.emptyOrNull(user_type)) user_type = "test"; else user_type = (user_type + "").substring(0, 40);
        if (verify.emptyOrNull(function_name)) function_name = "unknow"; else function_name = (function_name + "").substring(0, 400);
        if (verify.emptyOrNull(error_log)) error_log = ""; else error_log = (error_log + "");
        if (!verify.emptyOrNull(error_discribe)) error_discribe = (error_discribe + "");
        if (!verify.emptyOrNull(sql_query)) sql_query = (sql_query + "");
        if (!verify.emptyOrNull(sql_params)) sql_params = (sql_params + "");
        const sql = "INSERT INTO `error_logs` (`user_id`, `user_type`, `function_name`, `error_log`, `error_discribe`, `sql_query`, `sql_params`) VALUES(?, ?, ?, ?, ?, ?, ?)";
        await db.query(sql, [user_id, user_type, function_name, error_log, error_discribe, sql_query, sql_params]);
        cError(function_name + "：" + error_log);
    } catch (error) {
        cError(error);
    }
}

const cLog = (log) => {
    console.log(log);
}

const cError = (error) => {
    console.error(error);
}

module.exports = {
    ErrorHelper,
    dbLog,
    cLog,
    cError
}