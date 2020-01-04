const helper = require("../helper.js");
const ProductDao = require("../dao/productDao.js");
const Product2TagsDao = require("../dao/product2TagsDao.js");
const express = require("express");
var serviceRouter = express.Router();

var numPerPage = 10;

serviceRouter.get("/product/get/:id", (request, response) => {
    helper.log("service product: Client requested one record, id=" + request.params.id);

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        console.log(request.params.id);
        var result = productDao.loadById(request.params.id);
        console.log(result);
        helper.log("service product: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service product: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/all/", (request, response) => {
    helper.log("service product: Client requested all records");

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        var result = productDao.loadAll();
        helper.log("service product: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service product: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/resolutions/", (request, response) => {
    helper.log("service product: client requested all resolutions");
    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        var result = productDao.getAllResolutions();
        helper.log("service product: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service product: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));  
    }
});

serviceRouter.get("/product/page/:page/", (request, response) => {
    // /product/page/1/?tags=tag1&tags=tag2&search=search
    helper.log("service product: Client request page " + request.params.page);
    const productDao = new ProductDao(request.app.locals.dbConnection);
    var page = parseInt(request.params.page);
    var skip = page * numPerPage;
    const tags = request.query.tags;
    const search = request.query.tags;
    try {
        var count = productDao.count();
        var numPages = Math.ceil(count / numPerPage);
        if (page < numPages) {
            var result = {};
            result.products = (tags || search) ? productDao.loadFilteredByLimit(skip, numPerPage, tags, search) : productDao.loadByLimit(skip, numPerPage);
            result.pagination = {
                current: page,
                perPage: numPerPage,
                previous: page > 0 ? page - 1 : undefined,
                next: page < numPages - 1 ? page + 1 : undefined,
                numPages: numPages
            }
            response.status(200).json(helper.jsonMsgOK(result));
        } else {
            response.status(400).json(helper.jsonMsgError("page " + page + " is >= maxPage " + numPages));
        }
    } catch (ex) {
        helper.logError("service product: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/:id/tags/", (request, response) => {
    helper.log("service Tags: Client requested all tags from productid=" + request.params.id);

    const product2TagsDao = new Product2TagsDao(request.app.locals.dbConnection);
    try {
        var result = product2TagsDao.loadById(request.params.id);
        helper.log("service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/product/exists/:id", (request, response) => {
    helper.log("service product: Client requested check, if record exists, id=" + request.params.id);

    const productDao = new ProductDao(request.app.locals.dbConnection);
    try {
        var result = productDao.exists(request.params.id);
        helper.log("service product: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("service product: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;