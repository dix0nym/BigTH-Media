const helper = require("../helper.js");
const CountryDao = require("../dao/countryDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/country/all/", (request, response) => {
    helper.log("service Country: Client requested all records");

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.loadAll();
        helper.log("service Person: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("service Person: Error loading records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;