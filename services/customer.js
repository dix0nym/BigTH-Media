const helper = require("../helper.js");
const CustomerDao = require("../dao/customerDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/customer/get/:id", function(request, response) {
    helper.log("service Person: Client requested one record, id=" + request.params.id);

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var result = customerDao.loadById(request.params.id);
        helper.log("service Person: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Person: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/customer/all/", function(request, response) {
    helper.log("service Person: Client requested all records");

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var result = customerDao.loadAll();
        helper.log("service Person: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Person: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/customer/exists/:id", function(request, response) {
    helper.log("service Person: Client requested check, if record exists, id=" + request.params.id);

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var result = customerDao.exists(request.params.id);
        helper.log("service Person: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "exists": result }));
    } catch (ex) {
        helper.logError("service Person: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/customer", function(request, response) {
    helper.log("service Person: Client requested creation of new record");
    console.log(request.body);
    var errorMsgs=[];
    if (helper.isUndefined(request.body.title)) {
        errorMsgs.push("title missing");
    } else if (request.body.title.toLowerCase() !== "mr" && request.body.title.toLowerCase() !== "mrs") {
        errorMsgs.push("title wrong. Mr and Mrs are allowed");
    }        
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name missing");
    if (helper.isUndefined(request.body.surname)) 
        errorMsgs.push("surname missing");
    if (helper.isUndefined(request.body.addressid))
        errorMsgs.push("addressid missing");
    if (helper.isUndefined(request.body.phonenumber)) 
        request.body.phonenumber = "";
    if (helper.isUndefined(request.body.mail)) 
        errorMsgs.push("mail missing");
    if (!helper.isEmail(request.body.mail)) 
        errorMsgs.push("mail wrong format");
    if (helper.isUndefined(request.body.dateofbirth)) {
        request.body.dateofbirth = null;
    }
    
    if (errorMsgs.length > 0) {
        helper.log("service Person: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Creation not possible, data missing " + helper.concatArray(errorMsgs)));
        return;
    }

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var result = customerDao.create(request.body.title, request.body.name, request.body.surname, request.body.addressid, request.body.phonenumber, request.body.mail, request.body.dateofbirth);
        helper.log("service Person: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Person: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/customer", function(request, response) {
    helper.log("service Person: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id missing");
    if (helper.isUndefined(request.body.title)) {
        errorMsgs.push("title missing");
    } else if (request.body.title.toLowerCase() !== "mr" && request.body.title.toLowerCase() !== "mrs") {
        errorMsgs.push("title wrong. Mr and Mrs are allowd");
    }        
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name missing");
    if (helper.isUndefined(request.body.surname)) 
        errorMsgs.push("surname missing");
    if (helper.isUndefined(request.body.address)) {
        errorMsgs.push("address missing");
    } else if (helper.isUndefined(request.body.address.id)) {
        errorMsgs.push("address defined, but id missing");
    }
    if (helper.isUndefined(request.body.phonenumber)) 
        request.body.phonenumber = "";
    if (helper.isUndefined(request.body.mail)) 
        errorMsgs.push("mail missing");
    if (!helper.isEmail(request.body.mail)) 
        errorMsgs.push("mail wrong format");
    if (helper.isUndefined(request.body.dateofbirth)) {
        request.body.dateofbirth = null;
    } else if (!helper.isGermanDateTimeFormat(request.body.dateofbirth)) {
        errorMsgs.push("dateofbirth wrong format, allowed: dd.mm.jjjj");
    } else {
        request.body.dateofbirth = helper.parseDateTimeString(request.body.dateofbirth);
    }

    if (errorMsgs.length > 0) {
        helper.log("service Person: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update not possible, missing data: " + helper.concatArray(errorMsgs)));
        return;
    }

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var result = customerDao.update(request.body.id, request.body.title, request.body.name, request.body.surname, request.body.address.id, request.body.phonenumber, request.body.mail, request.body.dateofbirth);
        helper.log("service Person: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Person: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/customer/:id", function(request, response) {
    helper.log("service Person: Client requested deletion of record, id=" + request.params.id);

    const customerDao = new CustomerDao(request.app.locals.dbConnection);
    try {
        var obj = customerDao.loadById(request.params.id);
        customerDao.delete(request.params.id);
        helper.log("service Person: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "deleted": true, "entry": obj }));
    } catch (ex) {
        helper.logError("service Person: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;