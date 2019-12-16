const helper = require("../helper.js");
const ProductDao = require("./productDao.js");

class DownloadDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const productDao = new ProductDao(this._conn);

        var sql = "SELECT * FROM Download WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);
        result.product = productDao.loadById(result.productid);
        delete result.productid;
        return result;
    }

    loadAll() {
        var sql = "SELECT * FROM Download";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);
        for(var i = 0; i < result.length; i ++) {
            result.product = productDao.loadById(result.productid);
            delete result.productid;
        }
        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Download WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(uuid = "", productid = "") {
        var sql = "INSERT INTO Download (UUID,ProductID) VALUES (?,?)";
        var statement = this._conn.prepare(sql);
        var params = [uuid, productid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, uuid = "", productid = "") {
        var sql = "UPDATE Download SET UUID=?,ProductID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [uuid, productid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Download WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("DownloadDao [_conn=" + this._conn + "]");
    }
}

module.exports = DownloadDao;