const helper = require("../helper.js");
const SalesDao = require("../dao/salesDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/sales/get/:id", (request, response) => {
    helper.log("service Sales: Client requested one record, id=" + request.params.id);

    const salesDao = new SalesDao(request.app.locals.dbConnection);
    try {
        console.log(request.params.id);
        var result = salesDao.loadById(request.params.id);
        helper.log("service Sales: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Sales: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/sales/all/", (request, response) => {
    helper.log("service Sales: Client requested all records");

    const salesDao = new SalesDao(request.app.locals.dbConnection);
    try {
        var result = salesDao.loadAll();
        helper.log("service Sales: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Sales: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;