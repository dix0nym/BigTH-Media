const helper = require("../helper.js");
const TagsDao = require("../dao/tagDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/tags/get/:id", (request, response) => {
    helper.log("Service Tags: Client request tag with id=" + request.params.id);
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.loadById(request.params.id);
        helper.log("Service Tags: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/tags/all/", (request, response) => {
    helper.log("Service Tags: Client request all tags");
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.loadAll();
        helper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/tags/count/:id", (request, response) => {
    helper.log("Service Tags: Client request count of tag with id=" + request.params.id);
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.countById(request.params.id);
        helper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading tag count by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/tags/count/all/", (request, response) => {
    helper.log("Service Tags: Client request count of all tags ");
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.countAll();
        helper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading all tag counts. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;