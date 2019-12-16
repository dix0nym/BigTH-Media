const helper = require("../helper.js");
const ProductDao = require("./productDao.js");

class OrderpositionDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const productDao = new ProductDao(this._conn);

        var sql = "SELECT * FROM OrderPosition WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.order = { "id": result.orderid };
        delete result.orderid;
        
        result.product = productDao.loadById(result.productid);
        delete result.productid;

        result.vatsum = helper.round(result.amount * result.product.vatpart);
        result.netsum = helper.round(result.amount * result.product.netprice);
        result.grosssum = helper.round(result.amount * result.product.grossprice);

        return result;
    }

    loadAll() {
        const productDao = new ProductDao(this._conn);
        var products = productDao.loadAll();

        var sql = "SELECT * FROM OrderPosition";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            result[i].order = { "id": result[i].orderid };
            delete result[i].orderid;
        
            for (var element of products) {
                if (element.id == result[i].productid) {
                    result[i].produkt = element;
                    break;
                }
            }
            delete result[i].productid;

            result[i].vatsum = helper.round(result[i].amount * result[i].product.vatpart);
            result[i].netsum = helper.round(result[i].amount * result[i].product.netprice);
            result[i].grosssum = helper.round(result[i].amount * result[i].product.gross);
        }

        return result;
    }

    loadByParent(orderid) {
        const productDao = new ProductDao(this._conn);
        var products = productDao.loadAll();

        var sql = "SELECT * FROM OrderPostition WHERE OrderID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(orderid);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            result[i].order = { "id": result[i].orderid };
            delete result[i].orderid;
        
            for (var element of products) {
                if (element.id == result[i].productid) {
                    result[i].produkt = element;
                    break;
                }
            }
            delete result[i].productid;

            result[i].vatsum = helper.round(result[i].amount * result[i].product.vatpart);
            result[i].netsum = helper.round(result[i].amount * result[i].product.netprice);
            result[i].grosssum = helper.round(result[i].amount * result[i].product.grossprice);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM OrderPosition WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(orderid = 1, productid = 1, amount = 1) {
        var sql = "INSERT INTO OrderPosition (OrderID,ProductID,Amount) VALUES (?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [orderid, productid, amount];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, orderid = 1, productid = 1, amount = 1) {
        var sql = "UPDATE OrderPosition SET OrderID=?,ProductID=?,Amount=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [orderid, productid, amount, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM OrderPosition WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    deleteByParent(orderid) {
        try {
            var sql = "DELETE FROM OrderPosition WHERE OrderID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(orderid);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Records by bestellungid=" + bestellungid + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("OrderPositionDao [_conn=" + this._conn + "]");
    }
}

module.exports = OrderpositionDao;