const helper = require("../helper.js");
const AddressDao = require("./addressDao.js");

class CustomerDao {

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

        if (result.title == 0) 
            result.title = "Mr.";
        else 
            result.title = "Mrs.";

        result.dateofbirth = helper.parseSQLDateTimeString(result.dateofbirth);

        result.adresse = adresseDao.loadById(result.addressid);
        delete result.addressid;

        result.newsletter = !!result.newsletter;

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
            if (result[i].title == 0) 
                result[i].title = "Mr.";
            else 
                result[i].title = "Mrs.";

            result[i].dateofbirth = helper.parseSQLDateTimeString(result[i].dateofbirth);
            
            for (var element of addresses) {
                if (element.id == result[i].addressid) {
                    result[i].adresse = element;
                    break;
                }
            }
            delete result[i].addressid;

            result[i].newsletter = !!result[i].newsletter;
        }

        return result;
    }

    existsId(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Customer WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    exists(name, surname, addressid) {
        var sql = "SELECT ID as id, COUNT(ID) as cnt FROM Customer WHERE name=? and surname=? and addressid=?";
        var statement = this._conn.prepare(sql);
        var params = [name, surname, addressid];
        var result = statement.get(params);
        result = helper.arrayObjectKeysToLower(result);
        console.log(result)
        if (result.cnt > 0)
            return result.id;
        return false;
    }

    create(title = "Mr", name = "", surname = "", addressid = 1, phonenumber = "", mail = "", dateofbirth = null, newsletter = 0) {
        var id = this.exists(name, surname, addressid);
        console.log(id)
        if (id)
            return this.loadById(id);
        var sql = "INSERT INTO Customer (Title,Name,Surname,AddressID,PhoneNumber,Mail,DateOfBirth, Newsletter) VALUES (?,?,?,?,?,?,?, ?)";
        var statement = this._conn.prepare(sql);
        var params = [(title.toLowerCase() == 'mr' ? 0 : 1), name, surname, addressid, phonenumber, mail, (helper.isNull(dateofbirth) ? null : dateofbirth), (newsletter > 0) ? 1 : 0];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, title = "Mr", name = "", surname = "", addressid = 1, phonenumber = "", mail = "", dateofbirth = null, newsletter = 0) {
        var sql = "UPDATE Customer SET Title=?,Name=?,Surname=?,AddressID=?,PhoneNumber=?,Mail=?,DateOfBirth=?,Newsletter=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [(title.toLowerCase() == 'mr' ? 0 : 1), name, surname, addressid, phonenumber, mail, (helper.isNull(dateofbirth) ? null : dateofbirth), (newsletter > 0) ? 1 : 0, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Customer WHERE ID=?";
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
        helper.log("CustomerDao [_conn=" + this._conn + "]");
    }
}

module.exports = CustomerDao;