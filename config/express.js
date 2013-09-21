/**
 * express.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * ExpressJs Setup
 */
var express = require('express')
var mongoStore = require('connect-mongo')(express)
var helpers = require('view-helpers')
var hbshelpers = require('../app/lib/HandlebarHelpers')
var pkg = require('../package')
var env = process.env.NODE_ENV || 'development'
var exphbs  = require('express3-handlebars')
var paginate = require('handlebars-paginate')


module.exports = function (app, config) {

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
 V I E W    S E T U P :    H A N D L E B A R S
 *
 * The following section sets the Express view engine to use Handlebars.
 * Handlebars is a templating framework to crate dynamic views based on provided data
 ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */

  // Create `ExpressHandlebars` instance with a default layout.
  hbs = exphbs.create({
      defaultLayout: 'default',
      layoutsDir: 'app/views/layouts',
      helpers: hbshelpers,
      extname: '.hbs',

      // Uses multiple partials dirs, templates in "shared/templates/" are shared
      // with the client-side of the app (see below).
      partialsDir: [
          'app/views/partials/',
          'app/views/'
      ]
  });

  // Register paginate module as a helper to handlebars 
  hbs.handlebars.registerHelper('paginate', paginate)
  // Register `hbs` as our view engine using its bound `engine()` function.
  app.set('view engine', 'hbs');
  app.engine('hbs', hbs.engine);
  app.set('showStackError', true)

  // use express favicon
  app.use(express.favicon())

  // Set up assets folder
  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))

  // views config
  app.set('views', config.root + '/app/views')



/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
 G E N E R A L   E X P R E S S   C O N F I G U R A T I O N
 *
 * The following section is standard express setup.  the use method create general middlwares
 * in order to handle certain actions. Parsers, Loggers, Session, View directory, Logging
 ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */
  app.configure(function () {
    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // cookieParser should be above session
    app.use(express.cookieParser())
    app.use(express.session({
      secret: pkg.name,
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))


    // This allows the PKG and ENV vars to be accessible to controllers and views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      res.locals.env = env
      next()
    })

    // View helpers
    app.use(helpers(pkg.name))

    // routes should be at the last
    app.use(app.router)
    /*
     * Global Error Handlers
     */
    app.use(logErrors)
    app.use(handle500)
    app.use(handle404)
  })

  app.configure('development', function () {
    /*
     * Do stuff here for dev environment, for example:
     */
    app.locals.pretty = true;
  })

  app.configure('staging', function () {
    /*
     * Do stuff here for dev environment, for example:
     */
    app.locals.pretty = true;
  })

  /**
   * Private function, log errors
   */
  function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

  /**
   * 500 Error Handler
   */
  function handle500(err, req, res, next) {
    if (err.message
      && (~err.message.toLowerCase().indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next(err)
    } 
    // API errors return as JSON.
    if (req.url.indexOf('/api/') == 0) return res.status(500).json({ status : 500, error : err.name, message : err.message  })
    // All other errors return 500 Error Page
    res.status(500).render('500')    
  }

  /**
   * 404 Error Handler
   */
  function handle404(err, req, res, next) {
    if (req.url.indexOf('/api/') == 0) return res.status(404).json({ status : 404, error : err.name, message : err.message  })
    res.status(404).render('404', { url: req.originalUrl })  
  }  
}
