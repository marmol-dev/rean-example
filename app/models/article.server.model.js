'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    config = require('../../config/config'),
    thinky = require('thinky')(config.db),
    r = thinky.r,
    type = thinky.type;

/**
 * Article Schema
 */

var Article = thinky.createModel('articles', {
    created: type.date().default(Date.now),
    title: type.string().default(''),
    content: type.string().default(''),
    user: type.string()
}, {

});

module.exports = Article;
