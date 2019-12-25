const helper = require("../helper.js");
const AddressDao = require("../dao/addressDao.js");
const CountryDao = require("../dao/countryDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/address/get/:id", function(request, response) {
    helper.log("service Address: Client requested one record, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.loadById(request.params.id);
        helper.log("service Address: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Address: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/address/all/", function(request, response) {
    helper.log("service Address: Client requested all records");

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.loadAll();
        helper.log("service Address: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Address: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/address/exists/:id", function(request, response) {
    helper.log("service Address: Client requested check, if record exists, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.exists(request.params.id);
        helper.log("service Address: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("service Address: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/address", function(request, response) {
    console.log(request.body);
    helper.log("service Address: Client requested creation of new record");

    var errorMsgs = [];
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
    if (helper.isUndefined(request.body.countryid)) {
        console.log("country missing");
        errorMsgs.push("country missing");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("service Address: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Creation not possible, data missing: " + helper.concatArray(errorMsgs)));
        return;
    }

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    var country = countryDao.loadById(request.body.countryid);

    if (helper.isUndefined(country)) {
        // country not found
        helper.logError("service Address: Error creating new record. Exception occured: country not found by id:" + request.body.countryid);
        response.status(400).json(helper.jsonMsgError("country not found by id:" + request.body.countryid));
        return;
    }

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var result = addressDao.create(request.body.street, request.body.number, request.body.additionaladdressinfo, request.body.zip, request.body.city, request.body.countryid);
        helper.log("service Address: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Address: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/address/:id", function(request, response) {
    helper.log("service Address: Client requested deletion of record, id=" + request.params.id);

    const addressDao = new AddressDao(request.app.locals.dbConnection);
    try {
        var obj = addressDao.loadById(request.params.id);
        addressDao.delete(request.params.id);
        helper.log("service Address: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("service Address: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;