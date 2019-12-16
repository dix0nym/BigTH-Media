const helper = require("../helper.js");
const MehrwertsteuerDao = require("./mehrwertsteuerDao.js");
const ProductDao = require("./produktDao.js");

class SalesDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const productDao = new ProductDao(this._conn);

        var sql = "SELECT * FROM Sales WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) {
            throw new Error("No Record found by id=" + id);
        }

        sql = "SELECT * FROM P2A WHERE SalesID=?";
        statement = this._conn.prepare(sql);
        var productIDs = statement.get(id);

        


        result = helper.objectKeysToLower(result);

        result.MehrwertsteuerDao
    }

    loadAll() {
        const produktDao = new ProduktDao(this._conn);

        //var sql = "SELECT * FROM Product2Sales p2s INNER JOIN Sales s ON p2s.SalesID=s.SalesID";
        var sql = "SELECT * FROM Sales";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);
        console.log(result);
        result.forEach(sale => {
            sale.items = [];
            sale.maxHeight = 0;

            sql = "SELECT * FROM Product2Sales p2s INNER JOIN Product p ON p2s.ProductID=p.ID WHERE p2s.SalesID=?";
            statement = this._conn.prepare(sql);
            var productResult = statement.all(sale.id);

            if (helper.isArrayEmpty(productResult))
                return [];
            
            productResult = helper.arrayObjectKeysToLower(productResult);
            
            productResult.forEach(product => {
                var item = {
                    filename: product.filename,
                    title: product.title
                };

                sale.items.push(item);    
            })
        });

        console.log(result);

        return result;
    }
}

module.exports = SalesDao;