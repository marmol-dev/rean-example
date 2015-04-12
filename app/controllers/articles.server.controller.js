'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Article = require('../models/article.server.model'),
    _ = require('lodash'),
    r = require('thinky')().r;

/**
 * Create a article
 */
exports.create = function (req, res) {
    var article = new Article(req.body);
    article.userId = req.user.id;

    article.save(function (err) {
        console.log('articles.controller', 'create', 'save', 'err', err);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
    res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
    var article = req.article;

    article = _.extend(article, req.body);
    article.userId = req.article.user.id;

    console.log('articles.controller', 'update', 'article', article);

    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;

    article.delete(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Article.orderBy(r.desc('create'))
        .getJoin()
        .run()
        .then(function (articles) {
            res.json(articles);
        })
        .error(function (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
    console.log('articles.controller', 'byId', 'id', id);
    Article.get(id)
        .getJoin()
        .run()
        .then(function (article) {
            if (!article) return next(new Error('Failed to load article ' + id));
            req.article = article;
            console.log('todo bien');
            next();
        })
        .error(function (err) {
            console.error('articles.controller', 'byId', 'err', err);
            return next(err);
        });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
