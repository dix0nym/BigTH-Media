const helper = require("../helper.js");
const Produkt2TagsDao = require("../dao/produkt2TagsDao.js");
const TagsDao = require("../dao/tagDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/tags/:id", (request, response) => {
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

serviceRouter.get("/tags/alle", (request, response) => {
    helper.log("Service Tags: Client request all tags");
    const tagsDao = new TagsDao(request.app.locals.dbConnection);
    try {
        var result = tagsDao.loadAll();
        helper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;