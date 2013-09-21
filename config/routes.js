/**
 * routes.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * ExpressJs Routes Setup
 */
// Controller Definition
var triumphs = require('../app/controllers/TriumphController')
    , home = require('../app/controllers/HomeController')
  
/**
 * Endpoints
 */
module.exports = function (app) {

  app.get('/', home.index)

  // Web Triumph Endpoints
  app.get('/triumphs/', triumphs.index)
  app.get('/triumphs/new', triumphs.new)
  app.post('/triumphs', triumphs.create)
  app.get('/triumphs/:triumph_id', triumphs.show)
  app.get('/triumphs/:triumph_id/edit', triumphs.edit)
  app.put('/triumphs/:triumph_id', triumphs.update)
  app.del('/triumphs/:triumph_id', triumphs.destroy) 
  app.param('triumph_id', triumphs.load)

 // API Endpoints  
 app.get('/api/1', home.api)
 // app.all('/api/1/subscriptions*', subscriptions.validateAppUser)
 app.post('/api/1/triumphs/:triumph_id/rate', triumphs.rate)
}
