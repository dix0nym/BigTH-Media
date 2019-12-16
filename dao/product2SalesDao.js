const helper = require("../helper.js");
const MehrwertsteuerDao = require("./mehrwertsteuerDao.js");
const ProductDao = require("./productDao.js");

class Product2SalesDao {
    
    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadProductsBySalesId(id) {
        const productDao = new ProductDao(this._conn);
        
        var sql = "SELECT * FROM Product2Sales p2s INNER JOIN Product p ON p2s.ProductID=p.ProductID WHERE p2s.SalesID=?"
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);
    }
}