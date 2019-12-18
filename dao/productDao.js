const helper = require("../helper.js");
const VATDao = require("./vatDao.js");

class ProductDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const vatDao = new VATDao(this._conn);

        var sql = "SELECT * FROM Product WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.vat = vatDao.loadById(result.vatid);
        delete result.vatid;

        result.vatpart = helper.round((result.netprice / 100) * result.vat.percentage);

        result.grossprice = helper.round(result.netprice + result.vatpart);

        return result;
    }

    loadAll() {
        const vatDao = new VATDao(this._conn);
        var taxes = vatDao.loadAll();

        var sql = "SELECT * FROM Product";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of taxes) {
                if (element.id == result[i].vatid) {
                    result[i].vat = element;
                    break;
                }
            }
            delete result[i].vatid;

            result[i].vatPart = helper.round((result[i].netprice / 100) * result[i].vat.percentage);

            result[i].grossPrice = helper.round(result[i].netprice + result[i].vat.percentage);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Product WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    toString() {
        helper.log("ProductDao [_conn=" + this._conn + "]");
    }
}

module.exports = ProductDao;