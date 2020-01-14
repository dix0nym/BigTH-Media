const helper = require("../helper.js");
const TagsDao = require("../dao/tagDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/tags/get/:id", (request, response) => {
    helper.log("service Tags: Client request tag with id=" + request.params.id);
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.loadById(request.params.id);
        helper.log("service Tags: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/tags/all/", (request, response) => {
    helper.log("service Tags: Client request all tags");
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.loadAll();
        helper.log("service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Tags: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/tags/count/:id", (request, response) => {
    helper.log("service Tags: Client request count of tag with id=" + request.params.id);
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = (request.params.id === 'all') ? tagsDao.countAll() : tagsDao.countById(request.params.id);
        helper.log("service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Tags: Error loading tag count by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;