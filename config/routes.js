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
var triumphs = require('../app/controllers/TriumphController'),
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

   // Web Triumph Endpoints
   app.get('/triumphs/', auth, triumphs.index)
   app.get('/facts/new', auth, triumphs.new)
   app.post('/triumphs', auth, triumphs.create)
   app.get('/triumphs/:triumph_id', auth, triumphs.show)
   app.get('/triumphs/:triumph_id/edit', auth, triumphs.edit)
   app.put('/triumphs/:triumph_id', auth, triumphs.update)
   app.del('/triumphs/:triumph_id', auth, triumphs.destroy)
   app.param('triumph_id', triumphs.load)

   // API Endpoints  
   app.get('/api/1', home.api)
   app.post('/api/1/triumphs/:triumph_id/rate', triumphs.rate)
}