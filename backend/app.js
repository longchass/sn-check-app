const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const model = require('./models');
const cors = require('cors');
const app = express();
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://c019a13aa3c44740accc8e0795a9882e@sentry.io/1836887' });


app.use(Sentry.Handlers.requestHandler());



require('./util/mongoDB')
require('./util/schedule')

app.use(cors())


// The request handler must be the first middleware on the app


app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
require('dotenv').config()

model.sequelize.sync()
.then(() => console.log('Connect to database'))


app.use(require('express-status-monitor')())
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res, next) => {
    res.send('401')
})
app.use('/api', indexRouter);
app.use('/test', usersRouter);


// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());


module.exports = app;
