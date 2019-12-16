const helper = require("../helper.js");

class VATDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = "SELECT * FROM VAT WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        return helper.objectKeysToLower(result);
    }

    loadAll() {
        var sql = "SELECT * FROM VAT";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM VAT WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(bezeichnung = "", steuersatz = 19.0) {
        var sql = "INSERT INTO VAT (Title,Percentage) VALUES (?,?)";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, steuersatz];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, bezeichnung = "", steuersatz = 19.0) {
        var sql = "UPDATE VAT SET Title=?,Percentage=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, steuersatz, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM VAT WHERE ID=?";
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
        helper.log("VATDao [_conn=" + this._conn + "]");
    }
}

module.exports = VATDao;