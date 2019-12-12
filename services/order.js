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

    var errorMsgs=[];
    if (helper.isUndefined(request.body.ordertimestamp)) {
        request.body.ordertimestamp = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.ordertimestamp)) {
        errorMsgs.push("ordertimestamp hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss");
    } else {
        request.body.ordertimestamp = helper.parseGermanDateTimeString(request.body.ordertimestamp);
    }
    if (helper.isUndefined(request.body.customer)) {
        request.body.customer = null;
    } else if (helper.isUndefined(request.body.customer.id)) {
        errorMsgs.push("customer gesetzt, aber id missing");
    } else {
        request.body.customer = request.body.customer.id;
    }
    if (helper.isUndefined(request.body.paymentMethod)) {
        errorMsgs.push("paymentMethod missing");
    } else if (helper.isUndefined(request.body.paymentMethod.id)) {
        errorMsgs.push("paymentMethod gesetzt, aber id missing");
    }
    if (helper.isUndefined(request.body.oderposition)) {
        errorMsgs.push("oderposition fehlen");
    } else if (!helper.isArray(request.body.oderposition)) {
        errorMsgs.push("oderposition ist kein array");
    } else if (request.body.oderposition.length == 0) {
        errorMsgs.push("oderposition is leer, nichts zu speichern");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("Service Order: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.create(request.body.ordertimestamp, request.body.customer, request.body.paymentMethod.id, request.body.oderposition);
        helper.log("Service Order: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Order: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put("/order", function(request, response) {
    helper.log("Service Order: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id missing");
    if (helper.isUndefined(request.body.ordertimestamp)) {
        request.body.ordertimestamp = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.ordertimestamp)) {
        errorMsgs.push("wrong format of ordertimestamp, allowed: dd.mm.jjjj hh.mm.ss");
    } else {
        request.body.ordertimestamp = helper.parseGermanDateTimeString(request.body.ordertimestamp);
    }
    if (helper.isUndefined(request.body.customer)) {
        request.body.customer = null;
    } else if (helper.isUndefined(request.body.customer.id)) {
        errorMsgs.push("customer defined, but id missing");
    } else {
        request.body.customer = request.body.customer.id;
    }
    if (helper.isUndefined(request.body.paymentMethod)) {
        errorMsgs.push("paymentMethod missing");
    } else if (helper.isUndefined(request.body.paymentMethod.id)) {
        errorMsgs.push("paymentMethod defined, but id missing");
    }
    if (helper.isUndefined(request.body.oderposition)) {
        errorMsgs.push("oderposition missing");
    } else if (!helper.isArray(request.body.oderposition)) {
        errorMsgs.push("oderposition not an array");
    } else if (request.body.oderposition.length == 0) {
        errorMsgs.push("oderposition is empty, nothing to save");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Order: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("update not possible, missing data: " + helper.concatArray(errorMsgs)));
        return;
    }

    const orderDao = new OrderDao(request.app.locals.dbConnection);
    try {
        var result = orderDao.update(request.body.id, request.body.ordertimestamp, request.body.customer, request.body.paymentMethod.id, request.body.oderposition);
        helper.log("Service Order: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Order: Error updating record by id. Exception occured: " + ex.message);
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