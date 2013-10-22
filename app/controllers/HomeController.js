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
  , Triumph = mongoose.model('Triumph')
  , featFinder = require('../lib/FeatFinder')


/**
 * Chuck Node Landing Page
 * 
 * Example of using a custom lib to find data and passing callback
 */
exports.index = function (req, res, next) {
  featFinder.findRandomTriumph(function(err, triumph) {
    if (err) return next(err);
    else {
      return res.status(200).render('home', {
       triumph: triumph,
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
