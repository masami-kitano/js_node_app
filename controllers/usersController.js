'use strict';

const User = require('../models/user');

module.exports = {
    index: (req, res, next) => {
      User.find()
        .then(users => {
          res.locals.users = users;
          next();
        })
        .catch(error => {
          console.log(`Error fetching users: ${error.message}`);
          next(error);
        });
    },
    indexView: (req, res) => {
      res.render('users/index');
    },
    new: (req, res) => {
        res.render('users/new');
    },
    create: (req, res, next) => {
        let userParams = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        User.create(userParams)
            .then(user => {
                req.flash('success', `${user.name}さんのアカウントを作成しました！`);
                res.locals.redirect = '/';
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error saving user: ${error.message}`);
                res.locals.redirect = '/users/new';
                req.flash('error', `アカウントの作成に失敗しました。${error.message}`);
                next();
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    login: (req, res) => {
      res.render('users/login');
    },
    authenticate: (req, res, next) => {
      User.findOne({
        email: req.body.email
      })
        .then(user => {
          if (user && user.password === req.body.password) {
            res.locals.redirect = '/';
            req.flash('success', `${user.name}さん ログインに成功しました！`);
            res.locals.user = user;
            next();
          } else {
            req.flash(
              'error',
              'メールアドレスまたはパスワードに誤りがあります。'
            );
            res.locals.redirect = '/users/login';
            next();
          }
        })
        .catch(error => {
          console.log(`Error logging in user: ${error.message}`);
          next(error);
        });
    }
}