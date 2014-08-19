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
var mongoose = require('mongoose'),
   Fact = mongoose.model('Fact'),
   factFinder = require('../lib/FactFinder'),
   env = process.env.NODE_ENV || 'development',
   config = require('../../config/config')[env],
   https = require('https'),
   querystring = require('querystring'),
   url = require('url')

/**
 * Chuck Node Landing Page
 *
 * Example of using a custom lib to find data and passing callback
 */
exports.index = function(req, res, next) {
   factFinder.findRandomFact(function(err, fact) {
      if (err) return next(err);
      else {
         if (fact._id)
            return res.redirect('/' + fact._id);
         else
            return res.status(200).render('home', {
               fact: null,
               title: 'Chuck Norris Fact brought to you by Traackr and Node.js',
               layout: 'homeDefault'
            })
      }
   })
}

/*
 * Show Fact
 */
exports.getFact = function(req, res) {
   res.status(200).render('home', {
      fact: req.modelHolder.fact,
      title: 'Chuck Norris Fact brought to you by Traackr and Node.js: ' + req.modelHolder.fact.text,
      layout: 'homeDefault'
   })
}


/**
 * API Landing Page
 */
exports.api = function(req, res) {
   res.status(200).json({
      name: "Chuck Node",
      version: "0.0.1",
      status: "OK"
   })
}