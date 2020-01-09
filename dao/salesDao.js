const helper = require("../helper.js");
const VATDao = require("./vatDao.js");
const ProductDao = require("./productDao.js");

class SalesDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const vatDao = new VATDao(this._conn);

        var sql = "SELECT * FROM Sales WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) {
            throw new Error("No Record found by id=" + id);
        }

        result = helper.objectKeysToLower(result);
        
        result.items = [];

        sql = "SELECT * FROM Product2Sales p2s INNER JOIN Product p ON p2s.ProductID=p.ID WHERE p2s.SalesID=?";
        statement = this._conn.prepare(sql);
        var productResult = statement.all(id);
    
        productResult = helper.arrayObjectKeysToLower(productResult);

        productResult.forEach(product => {
            var item = {
                filename: product.filename,
                title: product.title
            };

            result.items.push(item);
        });

        result.vat = vatDao.loadById(result.vatid);
        delete result.vatid;

        result.vatpart = helper.round((result.netprice / 100) * result.vat.percentage);

        result.grossprice = helper.round(result.netprice + result.vatpart);

        return result;
    }

    loadAll() {
        const vatDao = new VATDao(this._conn);

        var sql = "SELECT * FROM Sales";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);
        console.log(result);
        result.forEach(sale => {
            console.log(sale);
            sale.items = [];

            sql = "SELECT * FROM Product2Sales p2s INNER JOIN Product p ON p2s.ProductID=p.ID WHERE p2s.SalesID=?";
            statement = this._conn.prepare(sql);
            var productResult = statement.all(sale.id);

            if (helper.isArrayEmpty(productResult))
                return [];
            
            productResult = helper.arrayObjectKeysToLower(productResult);
            console.log(productResult);
            productResult.forEach(product => {
                var item = {
                    filename: product.filename,
                    title: product.title
                };

                sale.items.push(item);    
            });

            // VAT calc
            // change sales.price to sales.grossprice
            
            sale.vat = vatDao.loadById(sale.vatid);
            delete sale.vatid;

            sale.vatpart = helper.round((sale.netprice / 100) * sale.vat.percentage);

            sale.grossprice = helper.round(sale.netprice + sale.vatpart);    
        });

        console.log(result);

        return result;
    }
}

module.exports = SalesDao;