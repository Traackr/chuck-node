/**
 * home.js 
 * Traackr: chuck-node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Home Controller
 */
var mongoose = require('mongoose')
  , Fact = mongoose.model('Fact')
  , featFinder = require('../lib/FeatFinder')


/**
 * Chuck Node Landing Page
 * 
 * Example of using a custom lib to find data and passing callback
 */
exports.index = function (req, res, next) {
  featFinder.findRandomFact(function(err, fact) {
    if (err) return next(err);
    else {
      return res.status(200).render('home', {
       fact: fact,
       layout : 'homeDefault'
      })
    }
  })
}

/**
 * API Landing Page
 */
exports.api = function(req, res) {
	res.status(200).json({ name : "Chuck Node", version : "0.0.1", status : "OK"})
}
