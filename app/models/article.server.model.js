'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    config = require('../../config/config'),
    thinky = require('thinky')(config.db),
    r = thinky.r,
    type = thinky.type,
    User = require('./user.server.model');

/**
 * Article Schema
 */

var Article = thinky.createModel('articles', {
    created: type.date().optional().allowNull().default(Date.now),
    title: type.string().default(''),
    content: type.string().default(''),
    userId: type.string()
}, {

});

Article.pre('save', function(next){
    this.created = new Date(this.created);
    next();
});

Article.belongsTo(User, 'user', 'userId', 'id');

module.exports = Article;
