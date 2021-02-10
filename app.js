'use strict';

const express = require('express'),
    app = express(),
    router = express.Router(),
    layouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    connectFlash = require('connect-flash'),
    errorController = require('./controllers/errorController'),
    homeController = require('./controllers/homeController'),
    usersController = require('./controllers/usersController');

mongoose.Promise = global.Promise;

mongoose.connect(
    'mongodb://localhost:27017/node_app', { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!');
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

router.use(express.static('public'));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(express.json());
router.use(cookieParser('secret_passcode'));
router.use(
  expressSession({
    secret: 'secret_passcode',
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
router.use(connectFlash());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

router.use(homeController.logRequestPaths);

router.get('/', homeController.index);

router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.post('/users/create', usersController.create, usersController.redirectView);
router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate, usersController.redirectView);

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use('/', router);

app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`);
});