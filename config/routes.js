/**
 * routes.js
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * ExpressJs Routes Setup
 * @example routing
 */
// Controller Definition
var facts = require('../app/controllers/FactController'),
   home = require('../app/controllers/HomeController'),
   express = require('express'),
   env = process.env.NODE_ENV || 'development',
   config = require('../config/config')[env],
   basicAuth = require('basic-auth');

var auth = function(req, res, next) {
   function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
   };

   var user = basicAuth(req);

   if (!user || !user.name || !user.pass) {
      return unauthorized(res);
   };

   if (user.name === config.user && user.pass === config.pass) {
      return next();
   } else {
      return unauthorized(res);
   };
};
/**
 * Endpoints
 */
module.exports = function(app) {

   app.get('/', home.index)
   app.get('/migrate', facts.tinyUrl)

   // Web Fact Endpoints
   app.get('/facts/', auth, facts.index)
   app.get('/facts/new', facts.new)
   app.post('/facts', facts.create)
   app.get('/facts/:fact_id', auth, facts.show)
   app.get('/facts/:fact_id/edit', auth, facts.edit)
   app.put('/facts/:fact_id', auth, facts.update)
   app.del('/facts/:fact_id', auth, facts.destroy)
   app.param('fact_id', facts.load)

   // Fact Bookmarkable
   app.get('/:fact_id', home.getFact);

   // API Endpoints  
   app.get('/api/1', home.api)
   app.post('/api/1/facts/:fact_id/rate', facts.rate)
}