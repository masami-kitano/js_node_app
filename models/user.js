'use strict';

const mongoose = require('mongoose'),
    { Schema } = mongoose,
    bcrypt = require('bcrypt'),
    passportLocalMongoose = require('passport-local-mongoose'),
    userSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    });

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt
        .hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(error => {
            console.log(`Error in hashing password: ${error.message}`);
            next(error);
        });
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
  });

module.exports = mongoose.model('User', userSchema);