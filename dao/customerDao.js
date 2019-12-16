const helper = require("../helper.js");
const AdresseDao = require("./addressDao.js");

class PersonDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const adresseDao = new AddressDao(this._conn);

        var sql = "SELECT * FROM Customer WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        if (result.anrede == 0) 
            result.anrede = "Mr.";
        else 
            result.anrede = "Mrs.";

        result.geburtstag = helper.formatToGermanDate(helper.parseSQLDateTimeString(result.geburtstag));

        result.adresse = adresseDao.loadById(result.adresseid);
        delete result.adresseid;

        return result;
    }

    loadAll() {
        const adresseDao = new AddressDao(this._conn);
        var addresses = adresseDao.loadAll();

        var sql = "SELECT * FROM Customer";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            if (result[i].anrede == 0) 
                result[i].anrede = "Mr.";
            else 
                result[i].anrede = "Mrs.";

            result[i].geburtstag = helper.formatToGermanDate(helper.parseSQLDateTimeString(result[i].geburtstag));
            
            for (var element of addresses) {
                if (element.id == result[i].adresseid) {
                    result[i].adresse = element;
                    break;
                }
            }
            delete result[i].adresseid;
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Customer WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(anrede = "Herr", vorname = "", nachname = "", adresseid = 1, telefonnummer = "", email = "", geburtstag = null) {
        var sql = "INSERT INTO Customer (Title,Name,Surname,AddressID,PhoneNummer,Mail,DateOfBirth) VALUES (?,?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [(helper.strStartsWith(anrede, "He") ? 0 : 1), vorname, nachname, adresseid, telefonnummer, email, (helper.isNull(geburtstag) ? null : helper.formatToSQLDate(geburtstag))];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, anrede = "Herr", vorname = "", nachname = "", adresseid = 1, telefonnummer = "", email = "", geburtstag = null) {
        var sql = "UPDATE Customer SET Title=?,Name=?,Surname=?,AddressID=?,PhoneNummer=?,Mail=?,DateOfBirth=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [(helper.strStartsWith(anrede, "He") ? 0 : 1), vorname, nachname, adresseid, telefonnummer, email, (helper.isNull(geburtstag) ? null : helper.formatToSQLDate(geburtstag)), id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Person WHERE ID=?";
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
        helper.log("PersonDao [_conn=" + this._conn + "]");
    }
}

module.exports = PersonDao;