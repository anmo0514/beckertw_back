const { json } = require("body-parser");

require("dotenv").config();

const { pool } = require(__dirname + "../../modules/mysql-connect");
const db = require(__dirname + "../../modules/mysql-connect");
const verify = require(__dirname + "../../modules/verify");
const tools = require(__dirname + "../../modules/tools");
const l = require(__dirname + "../../modules/logs");
const id = require(__dirname + "../../modules/identifier");

class DBModel {
    constructor (table) {
        this.table = (table + "").trim();
        this.selectSQL = "";
        this.insertSQL = "";
        this.updateSQL = "";
        this.deleteSQL = "";
        this.insertCols = [];
        this.updateCols = [];
        this.selectParams = [];
        this.insertParams = [];
        this.updateParams = [];
        this.deleteParams = [];
        this.selectWheres = [];
        this.updateWheres = [];
        this.deleteWheres = [];
        this.insertParamsSymble = [];
        this.add = (colName, param) => {
            this.insertCols.push('`' + colName.trim() + '`, ');
            this.updateCols.push('`' + colName.trim() + '` = ?, ');
            this.insertParams.push(param);
            this.updateParams.push(param);
            this.insertParamsSymble.push('?, ');
        }
        this.addWhere = (colName, condition, param, stringParams = "", stringQuery = "") => {
            
            if (stringQuery){
                this.updateWheres.push(stringQuery + "  ");
                this.selectWheres.push(stringQuery + "  ");
                this.deleteWheres.push(stringQuery + "  ");
            } else {
                this.updateWheres.push("`" + colName.trim() + "` " + condition + " " + (stringParams ? stringParams : "?") + " ");
                this.selectWheres.push("`" + colName.trim() + "` " + condition + " " + (stringParams ? stringParams : "?") + " ");
                this.deleteWheres.push("`" + colName.trim() + "` " + condition + " " + (stringParams ? stringParams : "?") + " ");
                if(!stringParams) {
                    this.updateParams.push(param);
                    this.selectParams.push(param);
                    this.deleteParams.push(param);
                }
            }
        }
        this.insert = async () => {
            try {
                if (this.insertCols.length > 0){
                    let insertSQLCols = this.insertCols.join(' ');
                    let insertSQLParamSymbles = this.insertParamsSymble.join(' ');
                    this.insertSQL = "INSERT INTO `" + this.table + 
                    "` (" + insertSQLCols.substring(0, insertSQLCols.length - 2) + ") VALUES (" + 
                    insertSQLParamSymbles.substring(0, insertSQLParamSymbles.length - 2) + ")";
                    const result = await transaction(this.insertSQL + "", this.insertParams);
                    return new QueryResult(result, "", 200);
                }
                return new QueryResult([{}], 'Insert column is empty.', 422);
            } catch (error) {
                await l.dbLog(0, 'system', 'mysql-excute.DBModel.insert', error, "", this.insertSQL, this.insertParams);
                return new QueryResult([{}], error, 403);
            }
        }
        this.update = async () => {
            try {
                if (this.updateCols.length > 0 && this.updateWheres.length > 0){
                    let updateSQLCols = this.updateCols.join(' ');
                    let updateSQLWheres = this.updateWheres.join(" AND ");
                    this.updateSQL = "UPDATE `" + this.table + 
                    "` SET " + updateSQLCols.substring(0, updateSQLCols.length - 2) + " WHERE " + 
                    updateSQLWheres;
                    const result = await transaction(this.updateSQL + "", this.updateParams);
                    return new QueryResult(result, "", 200);
                } 
                return new QueryResult([{}], 'Update column or where condition is empty.', 422);
            } catch (error) {
                await l.dbLog(0, 'system', 'mysql-excute.DBModel.update', error, "", this.updateSQL, this.updateParams);
                return new QueryResult([{}], error, 403);
            }
        }

        this.get = async (id_name, id) => {
            try {
                if (id && id_name && verify.integer(id)){
                    this.selectSQL = "SELECT * FROM `" + this.table + "` WHERE `" + id_name + "` = ? AND ";
                    if (this.selectWheres.length){
                        let selectSQLWheres = this.selectWheres.join(" AND ");
                        this.selectSQL = this.selectSQL + selectSQLWheres;
                    } else {
                        this.selectSQL = this.selectSQL.substring(0, this.selectSQL.length - 4);
                    }
                    this.selectParams.unshift(id);
                    const result = await search(this.selectSQL + "", this.selectParams);
                    return new QueryResult(result, "", 200);
                } 
                return new QueryResult([{}], 'Select condition is empty.', 422);
            } catch (error) {
                await l.dbLog(0, 'system', 'mysql-excute.DBModel.select', error, "", this.selectSQL, this.selectParams);
                return new QueryResult([{}], error, 403);
            }
        }

        this.getAll = async () => {
            try {
                this.selectSQL = "SELECT * FROM `" + this.table + "` ";
                const result = await search(this.selectSQL + "", this.selectParams);
                return new QueryResult(result, "", 200);
                    
            } catch (error) {
                await l.dbLog(0, 'system', 'mysql-excute.DBModel.select', error, "", this.selectSQL, this.selectParams);
                return new QueryResult([{}], error, 403);
            }
        }

        this.delete = async (id_name, id) => {
            try {
                if (id && id_name && verify.integer(id)){
                    this.deleteSQL = "DELETE FROM `" + this.table + "` WHERE `" + id_name + "` = ? AND ";
                    if (this.deleteWheres.length){
                        let deleteSQLWheres = this.deleteWheres.join(" AND ");
                        this.deleteSQL = this.deleteSQL + deleteSQLWheres;
                    } else {
                        this.deleteSQL = this.deleteSQL.substring(0, this.deleteSQL.length - 4);
                    }
                    this.deleteParams.unshift(id);
                    const result = await search(this.deleteSQL + "", this.deleteParams);
                    return new QueryResult(result, "", 200);
                    
                } 
                return new QueryResult([{}], 'Delete condition is empty.', 422);
            } catch (error) {
                await l.dbLog(0, 'system', 'mysql-excute.DBModel.delete', error, "", this.deleteSQL, this.deleteParams);
                return new QueryResult([{}], error, 403);
            }
        }
    }
}


class QueryResult {
    /**
     * Replace response json object, cleaner the code.
     * @param {json} data SQL data rows.
     * @param {string} msg Message of result, if empty will use default status code message.
     * @param {int} status Refer to HTTP status code, add new status code message below. 
     */
    constructor(data = [{}], msg = "", status = 0) {
        this.status = status;
        this.data = data;
        if (!msg){
            if (status === 200) this.msg = "Ok";
            else if (status === 400) this.msg = "Bad Request";
            else if (status === 403) this.msg = "Forbidden";
            else if (status === 404) this.msg = "Not Found";
            else if (status === 422) this.msg = "Unprocessable Entity";
            else this.msg = msg;
        } else {
            this.msg = msg;
        }       
    }
}

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                l.dbLog(id.user_id(), id.user_type(), "mysql-excute.getConnection", err);
                reject(err);
            }
            else resolve(connection); 
        });
    });
};

const queryConnection = (connection, sqlQuery, sqlParam = null) => {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, sqlParam, (err, result) => {
            if (err) {
                l.dbLog(id.user_id(), id.user_type(), "mysql-excute.queryConnection", err);
                reject(err);
            }
            else resolve (result);
        });
    });
};

const beginTransaction = (connection) => { 
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            if (err) {
                l.dbLog(id.user_id(), id.user_type(), "mysql-excute.beginTransaction", err);
                reject(err);
            }
            else resolve();
        });
    });
};

const commitTransaction = (connection) => { 
    return new Promise((resolve, reject) => {
        connection.commit(err => {
            if (err) {
                l.dbLog(id.user_id(), id.user_type(), "mysql-excute.commitTransaction", err);
                reject(err);
            }
            else resolve();
        });
    });
};

const rollbackTransaction = (connection) => { 
    return new Promise((resolve) => {
        connection.rollback(() => {
            resolve();
        });
    });
};
const transaction = async (sqlQuery, sqlParams = null) => {
    /** 
     * SQL Transaction for single and bulk sql query Insert or Update
     * @param {string} sqlQuery SQL query string.
     * @param {Array} sqlParams SQL parameters, 1 or 2 dimensionals array
     * @returns {Array} [Is success: boolean, SQL translaction result: JSON] 
    */
    let connection;
    let result = [];
    let success = true;
    try {
        connection = await getConnection();
        if (!connection) throw new Error('Error with get connection.');
        await beginTransaction(connection);

        if (!verify.emptyOrNull(sqlQuery)){
            result.push(await queryConnection(connection, sqlQuery, sqlParams));
        } else {
            throw new Error('Error with empty sql query.');
        }
        await commitTransaction(connection);
    } catch (error) {
        if (connection) await rollbackTransaction(connection);
        await l.dbLog(id.user_id(), id.user_type(),"mysql-excute.transaction", error);
        result = error;
        success = false;
        console.error('Transaction failed : ', error);
    } finally {
        if (connection) connection.release();
    }
    return [success, result];
};

const transactionMultiLine = async (sqlQuerys, sqlParams = null) => {
    /** 
     * SQL Transaction for multi line sql query Insert or Update.
     * @param {Array} sqlQuerys SQL query string in 1 dimensional array.
     * @param {Array} sqlParams SQL parameters, 2 dimensionals array.
     * @returns {Array} [Is success: boolean, SQL translaction result: JSON] 
    */
    let connection;
    let result = [];
    let success = true;
    try {
        connection = await getConnection();
        if (!connection) throw new Error('Error with get connection.');
        await beginTransaction(connection);

        if (verify.stringAbleOrArray(sqlQuerys)){
            throw new Error('Error with wrong sql query format, please use 1 dimensional array handle this, or use function transaction for single query.');
        } else if (sqlQuerys.length !== sqlParams.length) {
            throw new Error("SQL query array length should equal SQL params array length.");
        } else {
            for(let i = 0; i < sqlQuerys.length; i++){
                result.push(await queryConnection(connection, sqlQuerys[i], sqlParams[i]));
            }
        }
        await commitTransaction(connection);
    } catch (error) {
        if (connection) await rollbackTransaction(connection);
        await l.dbLog(id.user_id(), id.user_type(),"mysql-excute.transactionMultiLine", error);
        result = error;
        success = false;
        console.error('Transaction failed : ', error);
    } finally {
        if (connection) connection.release();
    }
    return [success, result];
};
  

const search = async (sqlQuery, sqlParams = null, selectTop1 = false) => {
    /** 
     * SQL Query for search
     * @param {string} sqlQuery SQL search query, required.
     * @param {Array} sqlParams SQL parameters, 1 dimensional array
     * @param {boolean} selectTop1 If true will only return top 1 row;
     * @returns {json} return rows data or empty array-dict json object.
    */
    try {
        if (verify.emptyOrNull(sqlQuery)) throw new Error("Error with empty SQL query.");
        const result = await db.query(sqlQuery, sqlParams, (err) => {
            l.dbLog(id.user_id(), id.user_type(), "mysql-excute.search", err, null, sqlQuery, sqlParams);
        });
        if (!result[0].length) return [{}];
        if (selectTop1) return [result[0][0]];
        else return result[0];
    } catch (err){
        l.dbLog(id.user_id(), id.user_type(), "mysql-excute.search", err, null, sqlQuery, sqlParams);
        return [{}];
    }
}


module.exports = {
    DBModel,
    QueryResult,
    transaction,
    transactionMultiLine,
    search,
}