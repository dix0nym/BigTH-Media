const helper = require("../helper.js");
const TagDao = require("../dao/tagDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/tags/:id", (request, response) => {
    helper.log("Service Tags: Client requested all tags from id=" + request.params.id);

    const tagDao = new TagDao(request.app.locals.dbConnection);
    try {
        var result = tagDao.loadById(request.params.id);
        herlper.log("Service Tags: Records loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Tags: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});