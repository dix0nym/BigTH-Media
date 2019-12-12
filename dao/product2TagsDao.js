const helper = require("../helper.js");
const TagDao = require("./tagDao.js");

class Product2TagsDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const tagDao = new TagDao(this._conn);
        var sql = "SELECT * FROM Product2Tags WHERE ProductID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);
        if (helper.isArrayEmpty(result))
            return [];
        result = helper.arrayObjectKeysToLower(result);
        var tags = [];
        for (var i = 0; i < result.length; i++) {
            tags.push(tagDao.loadById(result[i].tagid));
        }
        return tags;
    }

    loadAll() {
        var sql = "SELECT * from Product2Tags";
        var statement = this._conn.prepare(sql);
        var result = statement.all()

        if (helper.isArrayEmpty(result))
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        return result;
    }

    hasTags(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Product2Tags WHERE ProductID=?";
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

module.exports = Product2TagsDao;