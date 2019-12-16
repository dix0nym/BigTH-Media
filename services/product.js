const helper = require("../helper.js");
const ProductDao = require("../dao/productDao.js");
const Product2TagsDao = require("../dao/product2TagsDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/product/get/:id", function(request, response) {
    helper.log("Service Produkt: Client requested one record, id=" + request.params.id);

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        console.log(request.params.id);
        var result = productDao.loadById(request.params.id);
        console.log(result);
        helper.log("Service Produkt: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/all/", function(request, response) {
    helper.log("Service Produkt: Client requested all records");

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        var result = productDao.loadAll();
        helper.log("Service Produkt: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/:id/tags/", (request, response) => {
    helper.log("Service Tags: Client requested all tags from productid=" + request.params.id);

    const product2TagsDao = new Product2TagsDao(request.app.locals.dbConnection);
    try {
        var result = product2TagsDao.loadById(request.params.id);
        helper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/exists/:id", function(request, response) {
    helper.log("Service Produkt: Client requested check, if record exists, id=" + request.params.id);

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        var result = productDao.exists(request.params.id);
        helper.log("Service Produkt: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("Service Produkt: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;