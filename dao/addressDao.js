const helper = require("../helper.js");
const CountryDao = require("./countryDao.js");

class AddressDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const countryDao = new CountryDao(this._conn);

        var sql = "SELECT * FROM Address WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.land = countryDao.loadById(result.countryid);
        delete result.countryid;

        return result;
    }

    loadAll() {
        const countryDao = new CountryDao(this._conn);
        var countries = countryDao.loadAll();

        var sql = "SELECT * FROM Address";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of countries) {
                if (element.id == result[i].countryid) {
                    result[i].land = element;
                    break;
                }
            }
            delete result[i].countryid;
        }

        return result;
    }

    existsId(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Address WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    exists(street, number, zip, city, additionaladdressinfo, countryid) {
        var sql = "SELECT ID as id, COUNT(ID) as cnt FROM Address WHERE Street=? and Number=? and Zip=? and City=? and AdditionalAddressInfo=? and countryid=?";
        var statement = this._conn.prepare(sql);
        var params = [street, number, zip, city, additionaladdressinfo, countryid];
        var result = statement.get(params);
        result = helper.arrayObjectKeysToLower(result);
        if (result.cnt > 0)
            return result.id
        return false;
    }

    create(street = "", number = "", additionaladdressinfo = "", zip = "", city = "", countryid = 1) {
        var id = this.exists(street, number, zip, city, additionaladdressinfo, countryid);
        if (id) {
            var result = this.loadById(id);
            console.log("Address already exists: " + JSON.stringify(result));
            return result;
        }
        var sql = "INSERT INTO Address (Street,Number,AdditionalAddressInfo,ZIP,City,CountryID) VALUES (?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [street, number, additionaladdressinfo, zip, city, countryid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, street = "", number = "", additionaladdressinfo = "", zip = "", city = "", countryid = 1) {
        var sql = "UPDATE Adresse SET Street=?,Number=?,AdditionalAddressInfo=?,ZIP=?,City=?,CountryID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [street, number, additionaladdressinfo, zip, city, countryid, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Address WHERE ID=?";
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
        helper.log("AddressDao [_conn=" + this._conn + "]");
    }
}

module.exports = AddressDao;