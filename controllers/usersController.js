'use strict';

const User = require('../models/user');
const passport = require('passport'),
    getUserParams = body => {
        return {
            name: body.name,
            email: body.email,
            password: body.password,
            confirmPassword: body.confirmPassword
        };
    };

module.exports = {
    new: (req, res) => {
        res.render('users/new');
    },
    create: (req, res, next) => {
        if (req.skip) return next();
        const newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash('success', `${user.name}さんのアカウントを作成しました！`);
                res.locals.redirect = '/';
                next();
            } else {
                req.flash('error', `アカウントの作成に失敗しました。${error.message}`);
                res.locals.redirect = '/users/new';
                next();
            }
        });
    },
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    login: (req, res) => {
        res.render('users/login');
    },
    authenticate: passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: 'ログインに失敗しました。',
        successRedirect: '/',
        successFlash: 'ログインに成功しました！'
    }),
    validate: (req, res, next) => {
        req
            .sanitizeBody('email')
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req
            .check('name', '名前は必須項目です。')
            .notEmpty()
        req
            .check('email', 'メールアドレスが正しくありません。')
            .isEmail();
        req
            .check('password', 'パスワードは7文字以上で設定してください。')
            .notEmpty()
            .isLength({
              min: 7
            });
        req.getValidationResult().then(error => {
            if (!error.isEmpty()) {
                const messages = error.array().map(e => e.msg);
                req.skip = true;
                req.flash('error', messages.join(' '));
                res.locals.redirect = '/users/new';
                next();
            } else {
                next();
            }
        });
    }
}