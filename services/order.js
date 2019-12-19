const helper = require("../helper.js");
const OrderDao = require("../dao/orderDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/bestellung/get/:id", function(request, response) {
    helper.log("Service Order: Client requested one record, id=" + request.params.id);

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.loadById(request.params.id);
        helper.log("Service Order: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Order: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/order/all/", function(request, response) {
    helper.log("Service Order: Client requested all records");

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.loadAll();
        helper.log("Service Order: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Order: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/order/exists/:id", function(request, response) {
    helper.log("Service Order: Client requested check, if record exists, id=" + request.params.id);

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.exists(request.params.id);
        helper.log("Service Order: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("Service Order: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/order", function(request, response) {
    helper.log("Service Order: Client requested creation of new record");
    console.log(request.body);
    var errorMsgs=[];
    if (helper.isUndefined(request.body.ordertimestamp))
        request.body.ordertimestamp = helper.getNow();
    if (helper.isUndefined(request.body.customer)) {
        request.body.customer = null;
    } else if (helper.isUndefined(request.body.customer.id)) {
        errorMsgs.push("customer defined, but id missing");
    } else {
        request.body.customer = request.body.customer.id;
    }
    if (helper.isUndefined(request.body.paymentid))
        errorMsgs.push("paymentid missing");
    if (helper.isUndefined(request.body.orderposition)) {
        errorMsgs.push("orderposition missing");
    } else if (!helper.isArray(request.body.orderposition)) {
        errorMsgs.push("orderposition not an array");
    } else if (request.body.orderposition.length == 0) {
        errorMsgs.push("orderposition is empty, nothing to save");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Order: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("update not possible, missing data: " + helper.concatArray(errorMsgs)));
        return;
    }

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.update(request.body.id, request.body.ordertimestamp, request.body.customer, request.body.paymentMethod.id, request.body.orderposition);
        helper.log("Service Order: Record created, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Order: Error creating record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/order/:id", function(request, response) {
    helper.log("Service Order: Client requested deletion of record, id=" + request.params.id);

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var obj = orderDao.loadById(request.params.id);
        orderDao.delete(request.params.id);
        helper.log("Service Order: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("Service Order: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;