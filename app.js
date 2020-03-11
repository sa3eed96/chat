var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const passwordRouter = require('./routes/password');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();

require('./db/mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
var session = require('express-session');
const MemoryStore = require('memorystore')(session);
const memoryStore = new MemoryStore({ checkPeriod: 86400000 });
app.use(session({
secret: 'g32hg8237b39382hd2u',
store: memoryStore,
name: 'ssn_Id',
unset: 'destroy',
}));

app.use(indexRouter);
app.use(authRouter);
app.use(passwordRouter);

//user, room, messages routers moved to www to use io and socket instance.

module.exports = {app, memoryStore};
