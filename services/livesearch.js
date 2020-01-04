const helper = require("../helper.js");
const TagDao = require("../dao/tagDao.js");
const ProductDao = require("../dao/productDao.js");

const express = require("express");
var serviceRouter = express.Router();

serviceRouter.post("/livesearch", (request, response) => {
    if (helper.isUndefined(request.body.search)) {
        helper.log("service livesearch: search not possible, searchterm missing");
        response.status(400).json(helper.jsonMsgError("search not possible, searchterm missing"));
        return;
    }
    var search = request.body.search.toLowerCase();
    helper.log("service livesearch: search called with: " + search);
    const tagDao = new TagDao(request.app.locals.dbConnection);
    var tags = tagDao.search(search);
    result = tags.map(tag => { return { "name": tag.name }; });
    result = result.filter(tag => tag.name !== search);
    response.status(200).json(helper.jsonMsgOK(result));
});

module.exports = serviceRouter;