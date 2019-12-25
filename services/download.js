const helper = require("../helper.js");
const express = require("express");
const path = require('path');
const OrderPositionDao = require("../dao/orderpositionDao.js");

var serviceRouter = express.Router();

serviceRouter.get("/download/:uuid", function(request, response) {
    helper.log("service Download: Client requested download of order, uuid=" + request.params.uuid);

    const orderpositionDao = new OrderPositionDao(request.app.locals.dbConnection);
    try {
        var result = orderpositionDao.loadByUUID(request.params.uuid);
        const file = path.join("./public/media/original", result.product.filename);
        response.download(file)
        helper.log("service Download: File served");
    } catch (ex) {
        helper.logError("service Download: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;