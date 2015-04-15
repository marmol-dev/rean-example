'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    r = require('rethinkdb');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

/*var db = mongoose.connect(config.mongoDB, function (err) {
    if (err) {
        console.error(chalk.red('Could not connect to mongo'));
        console.log(chalk.red(err));
    }
});*/

// Bootstrap db connection
var db = require('./config/db').start();

db.then(function () {
        console.log(chalk.black('RethinkDB running on port ' + config.db.port));
        // Init the express application
        var app = require('./config/express')(db);

        // Bootstrap passport config
        require('./config/passport')();

        // Start the app by listening on <port>
        app.listen(config.port);
    })
    .error(function (err) {
        console.error(chalk.red('Could not connect to RethinkDB!'));
        console.log(chalk.red(err));
    });


// Expose app
//exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
