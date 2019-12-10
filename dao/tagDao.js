const helper = require("../helper.js");

class TagDao {
    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        
        var sql = "SELECT * FROM Tags WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error("No Record found by id=" + id);
        result = helper.objectKeysToLower(result);
        return result;
    }

    loadAll() {
        var sql = "SELECT * from Tags";
        var statement = this._conn.prepare(sql);
        var result = statement.all()

        if (helper.isArrayEmpty(result))
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Tags WHERE ID=?";
        var statement = statement.get(id);
        var result = statment.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    toString() {
        helper.log("Tags [_conn=" + this._conn + "]");
    }
}

module.exports = TagDao;