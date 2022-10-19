var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var venuesRouter = require('./routes/venues');
var adminsRouter = require('./routes/admins');


var app = express();

var dbConnectionPool = mysql.createPool({ host: 'localhost', database: 'covid_web_app'});
app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({                             //           //
  secret: 'a string of your choice',          //           //
  resave: false,                              // THIS CODE //
  saveUninitialized: true,                    //           //
  cookie: { secure: false }                   //           //
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/venues', venuesRouter);
app.use('/admins', adminsRouter);

module.exports = app;
