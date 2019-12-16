const helper = require("../helper.js");
const VATDao = require("../dao/vatDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/vat/get/:id", function(request, response) {
    helper.log("Service VAT: Client requested one record, id=" + request.params.id);

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var result = vatDao.loadById(request.params.id);
        helper.log("Service VAT: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service VAT: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/vat/all/", function(request, response) {
    helper.log("Service VAT: Client requested all records");

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var result = vatDao.loadAll();
        helper.log("Service VAT: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service VAT: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/vat/exists/:id", function(request, response) {
    helper.log("Service VAT: Client requested check, if record exists, id=" + request.params.id);

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var result = vatDao.exists(request.params.id);
        helper.log("Service VAT: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("Service VAT: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/vat", function(request, response) {
    helper.log("Service VAT: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push("title fehlt");
    if (helper.isUndefined(request.body.percentage)) {
        errorMsgs.push("percentage fehlt");
    } else if (!helper.isNumeric(request.body.percentage)) {
        errorMsgs.push("percentage muss eine Zahl sein");
    } else if (request.body.percentage <= 0) {
        errorMsgs.push("percentage muss eine Zahl > 0 sein");
    }        
    
    if (errorMsgs.length > 0) {
        helper.log("Service VAT: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var result = vatDao.create(request.body.title, request.body.percentage);
        helper.log("Service VAT: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service VAT: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/vat", function(request, response) {
    helper.log("Service VAT: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(request.body.percentage)) {
        errorMsgs.push("percentage fehlt");
    } else if (!helper.isNumeric(request.body.percentage)) {
        errorMsgs.push("percentage muss eine Zahl sein");
    } else if (request.body.percentage <= 0) {
        errorMsgs.push("percentage muss eine Zahl > 0 sein");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service VAT: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("update not possible. missing data: " + helper.concatArray(errorMsgs)));
        return;
    }

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var result = vatDao.update(request.body.id, request.body.bezeichnung, request.body.percentage);
        helper.log("Service VAT: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service VAT: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/vat/:id", function(request, response) {
    helper.log("Service VAT: Client requested deletion of record, id=" + request.params.id);

    const vatDao = new VATDao(request.app.locals.dbConnection);
    try {
        var obj = vatDao.loadById(request.params.id);
        vatDao.delete(request.params.id);
        helper.log("Service VAT: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("Service VAT: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;