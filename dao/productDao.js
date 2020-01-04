const helper = require("../helper.js");
const VATDao = require("./vatDao.js");
const Product2TagsDao = require("./product2TagsDao.js");

class ProductDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const vatDao = new VATDao(this._conn);

        const product2TagsDao = new Product2TagsDao(this._conn);

        var sql = "SELECT * FROM Product WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.tags = product2TagsDao.loadById(result.id);

        result.vat = vatDao.loadById(result.vatid);
        delete result.vatid;

        result.vatpart = helper.round((result.netprice / 100) * result.vat.percentage);

        result.grossprice = helper.round(result.netprice + result.vatpart);

        return result;
    }

    loadAll() {
        const vatDao = new VATDao(this._conn);
        var taxes = vatDao.loadAll();

        const product2TagsDao = new Product2TagsDao(this._conn);

        var sql = "SELECT * FROM Product";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);
        for (var i = 0; i < result.length; i++) {
            for (var element of taxes) {
                if (element.id == result[i].vatid) {
                    result[i].vat = element;
                    break;
                }
            }
            delete result[i].vatid;
            result[i].tags = product2TagsDao.loadById(result[i].id);
            result[i].vatpart = helper.round((result[i].netprice / 100) * result[i].vat.percentage);
            result[i].grossprice = helper.round(result[i].netprice + result[i].vatpart);
        }
        return result;
    }

    loadByLimit(start, count) {
        const vatDao = new VATDao(this._conn);
        var taxes = vatDao.loadAll();

        const product2TagsDao = new Product2TagsDao(this._conn);

        var sql = "SELECT * FROM Product LIMIT " + start + ", " + count;
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);
        for (var i = 0; i < result.length; i++) {
            for (var element of taxes) {
                if (element.id == result[i].vatid) {
                    result[i].vat = element;
                    break;
                }
            }
            delete result[i].vatid;
            result[i].tags = product2TagsDao.loadById(result[i].id);
            result[i].vatPart = helper.round((result[i].netprice / 100) * result[i].vat.percentage);
            result[i].grossPrice = helper.round(result[i].netprice + result[i].vat.percentage);
        }
        return result;
    }

    loadFilteredByLimit(start, count, queriedtags, queriedRezs, price_start, price_end) {
        var products = this.loadAll();
        var tagsCount = {};
        var rezCount = {};
        for (var i = products.length - 1; i >= 0; i--) {
            var product = products[i];
            console.log(product)
            var hasAllTags = queriedtags.every(tag => {
                return product.tags.some(t => t.name === tag)
            });
            var hasOneResz = (helper.isArrayEmpty(queriedRezs)) ? true : queriedRezs.some(rez => { return product.resolution == rez; });

            var inPriceRange = true;
            if (price_start && price_start > 0) {
                inPriceRange = product.grossprice >= price_start;
            }
            if (price_end && price_end > 0) {
                inPriceRange = product.grossPrice <= price_end;
            }
            if (!hasAllTags || !hasOneResz || !inPriceRange) {
                products.splice(i, 1);
            } else {
                for (var tag of product.tags) {
                    if (!(tag.name in tagsCount)) {
                        tagsCount[tag.name] = 0;
                    }
                    tagsCount[tag.name]++;
                }
                if (!(product.resolution in rezCount)) {
                    rezCount[product.resolution] = 0;
                }
                rezCount[product.resolution]++;
            }
        }
        return { products: products.slice((start < 0) ? start - 1 : start, start + count), count: products.length, tagscount: tagsCount, rezcount: rezCount };
    }

    getAllResolutions() {
        var sql = "SELECT Resolution as name, COUNT(ID) as count FROM Product GROUP BY Resolution";
        var statment = this._conn.prepare(sql);
        var result = statment.all();
        result = helper.arrayObjectKeysToLower(result);
        return result;
    }

    count() {
        var sql = "SELECT COUNT(ID) as cnt FROM Product";
        var statement = this._conn.prepare(sql);
        var result = statement.get();
        return result.cnt;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Product WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    toString() {
        helper.log("ProductDao [_conn=" + this._conn + "]");
    }
}

module.exports = ProductDao;