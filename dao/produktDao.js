const helper = require("../helper.js");
const MehrwertsteuerDao = require("./mehrwertsteuerDao.js");
const DownloadDao = require("./downloadDao.js");
const ProduktbildDao = require("./produktbildDao.js");
const Produkt2TagsDao = require("./produkt2TagsDao.js");

class ProduktDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        const downloadDao = new DownloadDao(this._conn);
        const produktbildDao = new ProduktbildDao(this._conn);
        const product2TagsDao = new Produkt2TagsDao(this._conn);

        var sql = "SELECT * FROM Produkt WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.mehrwertsteuer = mehrwertsteuerDao.loadById(result.mehrwertsteuerid);
        delete result.mehrwertsteuerid;
        
        // result.tags = product2TagsDao.loadById(id);

        if (helper.isNull(result.datenblattid)) {
            result.datenblatt = null;
        } else {
            result.datenblatt = downloadDao.loadById(result.downloadid);
        }
        delete result.datenblattid;
        result.bilder = produktbildDao.loadByParent(result.id);
        for (i = 0; i < result.bilder.length; i++) {
            delete result.bilder[i].produktid;
        }

        result.mehrwertsteueranteil = helper.round((result.nettopreis / 100) * result.mehrwertsteuer.steuersatz);

        result.bruttopreis = helper.round(result.nettopreis + result.mehrwertsteueranteil);

        return result;
    }

    loadAll() {
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();
        const downloadDao = new DownloadDao(this._conn);

        var sql = "SELECT * FROM Produkt";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            if (helper.isNull(result[i].downloadid)) {
                result[i].download = null;
            } else {
                result[i].download = downloadDao.loadById(result[i].downloadid);
            }
            delete result[i].downloadid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.produktid == result[i].id) {
                    delete element.produktid;
                    result[i].bilder.push(element);
                }
            }

            result[i].mehrwertsteueranteil = helper.round((result[i].nettopreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttopreis = helper.round(result[i].nettopreis + result[i].mehrwertsteueranteil);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Produkt WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(bezeichnung = "", beschreibung = "", mehrwertsteuerid = 1, details = null, nettopreis = 0.0, datenblattid = null, bilder = []) {
        const produktbildDao = new ProduktbildDao(this._conn);

        var sql = "INSERT INTO Produkt (Bezeichnung,Beschreibung,MehrwertsteuerID,Details,Nettopreis,DatenblattID) VALUES (?,?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, mehrwertsteuerid, details, nettopreis, datenblattid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        if (bilder.length > 0) {
            for (var element of bilder) {
                produktbildDao.create(element.bildpfad, result.lastInsertRowid);
            }
        }

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, bezeichnung = "", beschreibung = "", mehrwertsteuerid = 1, details = null, nettopreis = 0.0, datenblattid = null, bilder = []) {
        const produktbildDao = new ProduktbildDao(this._conn);
        produktbildDao.deleteByParent(id);

        var sql = "UPDATE Produkt SET Bezeichnung=?,Beschreibung=?,MehrwertsteuerID=?,Details=?,Nettopreis=?,DatenblattID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, mehrwertsteuerid, details, nettopreis, datenblattid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        if (bilder.length > 0) {
            for (var element of bilder) {
                produktbildDao.create(element.bildpfad, id);
            }
        }

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            const produktbildDao = new ProduktbildDao(this._conn);
            produktbildDao.deleteByParent(id);

            var sql = "DELETE FROM Produkt WHERE ID=?";
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
        helper.log("ProduktDao [_conn=" + this._conn + "]");
    }
}

module.exports = ProduktDao;