var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// database

const Database = require("better-sqlite3");
const dbOptions = { verbose: console.log };
const dbFile = "./db/db.sqlite";
const dbConnection = new Database(dbFile, dbOptions);

// express

var app = express();
app.locals.dbConnection = dbConnection;

app.use(logger('dev'));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// public - serve html

app.get("/", (request, response) => {
    response.render('index');
});

// APIs

TOPLEVELPATH = "/api/";

serviceRouter = require("./services/address.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/customer.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/download.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/paymentmethod.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/vat.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/product.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/order.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/tags.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/country.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/sales.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/livesearch.js");
app.use(TOPLEVELPATH, serviceRouter);

module.exports = app;