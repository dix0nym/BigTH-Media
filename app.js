var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helper = require("./helper.js");

// var indexRouter = require('./routes/indexRouter');

// database

const Database = require("better-sqlite3");
const dbOptions = { verbose: console.log };
const dbFile = "./db/db.sqlite";
const dbConnection = new Database(dbFile, dbOptions);

// express

var app = express();
app.locals.dbConnection = dbConnection;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes

// public
app.get("/", (request, response) => {
    response.render('index');
});

// APIs
TOPLEVELPATH = "/api/";

serviceRouter = require("./services/adresse.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/person.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/download.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/zahlungsart.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/mehrwertsteuer.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/produktbild.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/produkt.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/bestellung.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/bewertung.js");
app.use(TOPLEVELPATH, serviceRouter);

serviceRouter = require("./services/tags.js");
app.use(TOPLEVELPATH, serviceRouter);

module.exports = app;
