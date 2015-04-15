'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    User = require('../app/models/user.server.model'),
    path = require('path'),
    config = require('./config');

/**
 * Module init function.
 */
module.exports = function () {
    // Serialize sessions
    passport.serializeUser(function (user, done) {
        console.log('passport', 'serializeUser', user);
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function (id, done) {
        User.get(id)
            .without(['salt', 'password'])
            .run()
            .then(function (user) {
                console.log('passport.js', 'deserializeUser', user);
                done(null, user);
            })
            .error(function (err) {
                console.error('passport.js', 'deserializeUser', 'error', err);
                done(err);
            });
    });

    // Initialize strategies
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
        require(path.resolve(strategy))();
    });
};
