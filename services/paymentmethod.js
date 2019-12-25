const helper = require("../helper.js");
const PaymentMethodDao = require("../dao/paymentMethodDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/paymentmethod/get/:id", function(request, response) {
    helper.log("service PaymentMethod: Client requested one record, id=" + request.params.id);

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var result = paymentmethodDao.loadById(request.params.id);
        helper.log("service PaymentMethod: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/paymentmethod/alle", function(request, response) {
    helper.log("service PaymentMethod: Client requested all records");

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var result = paymentmethodDao.loadAll();
        helper.log("service PaymentMethod: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/paymentmethod/exists/:id", function(request, response) {
    helper.log("service PaymentMethod: Client requested check, if record exists, id=" + request.params.id);

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var result = paymentmethodDao.exists(request.params.id);
        helper.log("service PaymentMethod: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/paymentmethod", function(request, response) {
    helper.log("service PaymentMethod: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push("title missing");
    
    if (errorMsgs.length > 0) {
        helper.log("service PaymentMethod: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Creation not possible, data missing: " + helper.concatArray(errorMsgs)));
        return;
    }

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var result = paymentmethodDao.create(request.body.title);
        helper.log("service PaymentMethod: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/paymentmethod", function(request, response) {
    helper.log("service PaymentMethod: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push("title fehlt");

    if (errorMsgs.length > 0) {
        helper.log("service PaymentMethod: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update not possible, data missing: " + helper.concatArray(errorMsgs)));
        return;
    }

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var result = paymentmethodDao.update(request.body.id, request.body.title);
        helper.log("service PaymentMethod: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/paymentmethod/:id", function(request, response) {
    helper.log("service PaymentMethod: Client requested deletion of record, id=" + request.params.id);

    const paymentmethodDao = new PaymentMethodDao(request.app.locals.dbConnection);
    try {
        var obj = paymentmethodDao.loadById(request.params.id);
        paymentmethodDao.delete(request.params.id);
        helper.log("service PaymentMethod: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("service PaymentMethod: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;