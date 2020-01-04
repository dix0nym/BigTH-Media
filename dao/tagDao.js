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

    countById(id) {
        var sql = "SELECT COUNT(ProductID) as count FROM Product2Tags WHERE TagID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);
        return result.cnt;
    }

    countAll() {
        var tags = this.loadAll();
        tags = new Map(tags.map(tag => [tag.id, tag]));
        var sql = "SELECT TagID, COUNT(ProductID) as count FROM Product2Tags GROUP BY TagID";
        var statment = this._conn.prepare(sql);
        var result = statment.all();
        result = helper.arrayObjectKeysToLower(result);
        for (var i = 0; i < result.length; i++) {
            var tmp = tags.get(result[i].tagid);
            Object.assign(result[i], tmp);
            delete result[i].tagid;
        }
        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Tags WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;
        return false;
    }

    search(needle) {
        var sql = "SELECT * FROM Tags WHERE Name LIKE '%" + needle + "%'";
        var statement = this._conn.prepare(sql);
        var result = statement.all();
        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        return result;
    }

    toString() {
        helper.log("Tags [_conn=" + this._conn + "]");
    }
}

module.exports = TagDao;