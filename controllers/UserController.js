const express = require('express');

module.exports = {
    doGetLogin: function (req, res) {
        res.render('login.ejs');
    },

    doGetRegister: function (req, res) {
        res.render('register.ejs');
    }
}