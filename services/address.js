const helper = require("../helper.js");
const AddressDao = require("../dao/addressDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/address/get/:id", function(request, response) {
    helper.log("Service Address: Client requested one record, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.loadById(request.params.id);
        helper.log("Service Address: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Address: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/address/all/", function(request, response) {
    helper.log("Service Address: Client requested all records");

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.loadAll();
        helper.log("Service Address: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Address: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/address/exists/:id", function(request, response) {
    helper.log("Service Address: Client requested check, if record exists, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.exists(request.params.id);
        helper.log("Service Address: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("Service Address: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/address", function(request, response) {
    helper.log("Service Address: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.street)) 
        errorMsgs.push("street missing");
    if (helper.isUndefined(request.body.number)) 
        errorMsgs.push("number missing");
    if (helper.isUndefined(request.body.additionaladdressinfo)) 
        request.body.additionaladdressinfo = "";
    if (helper.isUndefined(request.body.zip)) 
        errorMsgs.push("zip missing");
    if (helper.isUndefined(request.body.city)) 
        errorMsgs.push("city missing");
    if (helper.isUndefined(request.body.country)) {
        errorMsgs.push("land missing");
    } else if (helper.isUndefined(request.body.country.id)) {
        errorMsgs.push("land.id missing");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("Service Address: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Creation not possible, data missing: " + helper.concatArray(errorMsgs)));
        return;
    }

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.create(request.body.street, request.body.number, request.body.additionaladdressinfo, request.body.zip, request.body.city, request.body.country.id);
        helper.log("Service Address: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Address: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/address", function(request, response) {
    helper.log("Service Address: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id missing");
    if (helper.isUndefined(request.body.strasse)) 
        errorMsgs.push("strasse missing");
    if (helper.isUndefined(request.body.number)) 
        errorMsgs.push("number missing");
    if (helper.isUndefined(request.body.additionaladdressinfo)) 
        request.body.additionaladdressinfo = "";
    if (helper.isUndefined(request.body.zip)) 
        errorMsgs.push("zip missing");
    if (helper.isUndefined(request.body.city)) 
        errorMsgs.push("city missing");
    if (helper.isUndefined(request.body.country)) {
        errorMsgs.push("land missing");
    } else if (helper.isUndefined(request.body.country.id)) {
        errorMsgs.push("land.id missing");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Address: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update not possible. Missing data: " + helper.concatArray(errorMsgs)));
        return;
    }

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.update(request.body.id, request.body.strasse, request.body.number, request.body.adresszusatz, request.body.zip, request.body.city, request.body.land.id);
        helper.log("Service Address: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Address: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/address/:id", function(request, response) {
    helper.log("Service Address: Client requested deletion of record, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var obj = addressDao.loadById(request.params.id);
        addressDao.delete(request.params.id);
        helper.log("Service Address: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("Service Address: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.expcitys = serviceRouter;