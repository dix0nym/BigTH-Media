const helper = require("../helper.js");
const SalesDao = require("../dao/salesDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/api/sales/get/:id", function(request, response) {
    helper.log("Service Sales: Client requested one record, id=" + request.params.id);

    const salesDao = new SalesDao(request.app.locals.dbConnection);
    try {
        console.log(request.params.id);
        var result = salesDao.loadById(request.params.id);
        helper.log("Service Sales: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Sales: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/sales/all/", function(request, response) {
    helper.log("Service Sales: Client requested all records");

    const salesDao = new SalesDao(request.app.locals.dbConnection);
    try {
        var result = salesDao.loadAll();
        helper.log("Service Sales: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Sales: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;