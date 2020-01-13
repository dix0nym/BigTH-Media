const helper = require("../helper.js");
const OrderPositionDao = require("./orderpositionDao.js");
const CustomerDao = require("./customerDao.js");
const PaymentMethodDao = require("./paymentMethodDao.js");
const uuidv4 = require('uuid/v4');
const SalesDao = require("./salesDao.js");

class OrderDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const orderPositionDao = new OrderPositionDao(this._conn);
        const customerDao = new CustomerDao(this._conn);
        const paymentMethodDao = new PaymentMethodDao(this._conn);

        var sql = "SELECT * FROM `Order` WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.orderTime = helper.parseSQLDateTimeString(result.orderdate);

        if (helper.isNull(result.customerid)) {
            result.customer = null;
        } else {
            result.customer = customerDao.loadById(result.customerid);
        }
        delete result.customerid;

        result.paymentmethod = paymentMethodDao.loadById(result.paymentid);
        delete result.paymentid;

        result.orderpositions = orderPositionDao.loadByParent(result.id);

        result.total = { "net": 0, "gross": 0, "vat": 0 };

        for (i = 0; i < result.orderpositions.length; i++) {
            result.total.net += result.orderpositions[i].netsum;
            result.total.gross += result.orderpositions[i].grosssum;
            result.total.vat += result.orderpositions[i].vatsum;
        }

        result.total.net = helper.round(result.total.net);
        result.total.gross = helper.round(result.total.gross);
        result.total.vat = helper.round(result.total.vat);

        return result;
    }

    loadAll() {
        const orderPositionDao = new OrderPositionDao(this._conn);
        var positions = orderPositionDao.loadAll();
        const customerDao = new customerDao(this._conn);
        var persons = customerDao.loadAll();
        const paymentMethodDao = new PaymentMethodDao(this._conn);
        var methods = paymentMethodDao.loadAll();

        var sql = "SELECT * FROM Order";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            if (helper.isNull(result[i].customerid)) {
                result[i].besteller = null;
            } else {
                for (var element of persons) {
                    if (element.id == result[i].customerid) {
                        result[i].besteller = element;
                        break;
                    }
                }
            }
            delete result[i].customerid;

            for (var element of methods) {
                if (element.id == result[i].paymentid) {
                    result[i].zahlungsart = element;
                    break;
                }
            }
            delete result[i].paymentid;

            result[i].orderpositions = [];

            result[i].total = { "net": 0, "gross": 0, "vat": 0 };

            for (var element of positions) {
                if (element.order.id == result[i].id) {
                    result[i].total.net += element.netsum;
                    result[i].total.gross += element.grosssum;
                    result[i].total.vat += element.vatsum;
                    result[i].orderpositions.push(element);
                }
            }

            result[i].total.net = helper.round(result[i].total.nettotal);
            result[i].total.gross = helper.round(result[i].total.grosstotal);
            result[i].total.vat = helper.round(result[i].total.vat);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM `Order` WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(orderdate = null, customerid = null, paymentid = null, orderpositions = []) {
        const orderPositionDao = new OrderPositionDao(this._conn);
        const salesDao = new SalesDao(this._conn);

        if (helper.isNull(orderdate)) {
            orderdate = helper.getNow();
        }
        var sql = "INSERT INTO `Order` (OrderDate,CustomerID,PaymentID) VALUES (?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [helper.formatToSQLDateTime(orderdate), customerid, paymentid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error("Could not insert new Record. Data: " + params);

        if (orderpositions.length > 0) {
            for (var element of orderpositions) {
                if (element.id > 1000) {
                    var sale = salesDao.loadById(element.id);
                    sale.items.foreach(item => {
                        orderPositionDao.create(result.lastInsertRowid, item.id, element.amount, uuidv4());
                    });
                } else {
                    orderPositionDao.create(result.lastInsertRowid, element.id, element.amount, uuidv4());
                }
            }
        }
        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, orderdate = null, customerid = null, paymentid = null, orderpositions = []) {
        const orderPositionDao = new OrderPositionDao(this._conn);
        orderPositionDao.deleteByParent(id);

        if (helper.isNull(orderdate))
            orderdate = helper.getNow();

        var sql = "UPDATE `Order` SET OrderDate=?,CustomerID=?,ZahlungsartID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [helper.formatToSQLDateTime(orderdate), customerid, paymentid, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error("Could not update existing Record. Data: " + params);

        if (orderpositions.length > 0) {
            for (var element of orderpositions) {
                orderPositionDao.create(id, element.product.id, element.amount);
            }
        }

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            const orderPositionDao = new OrderPositionDao(this._conn);
            orderPositionDao.deleteByParent(id);

            var sql = "DELETE FROM `Order` WHERE ID=?";
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
        helper.log("OrderDao [_conn=" + this._conn + "]");
    }
}

module.exports = OrderDao;