'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const errorController = require('./controllers/errorController');
const homeController = require('./controllers/homeController');
const usersController = require('./controllers/usersController');
const User = require('./models/user');

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
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(connectFlash());

router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});
router.use(expressValidator());
router.use(homeController.logRequestPaths);

router.get('/', homeController.index);

router.get('/users/new', usersController.new);
router.post('/users/create', usersController.validate, usersController.create, usersController.redirectView);
router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate);

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use('/', router);

app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`);
});