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
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var helpers = require('view-helpers')
var hbshelpers = require('../app/lib/HandlebarHelpers')
var pkg = require('../package')
var env = process.env.NODE_ENV || 'development'
var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var paginate = require('handlebars-paginate')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')


module.exports = function(app, config) {

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
 V I E W    S E T U P :    H A N D L E B A R S
 *
 * The following section sets the Express view engine to use Handlebars.
 * Handlebars is a templating framework to crate dynamic views based on provided data
 * @example of using handlebars w/ express @see express-handlebars module
 ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */

  // Create `ExpressHandlebars` instance with a default layout.
  hbs = exphbs.create({
    defaultLayout: 'default',
    layoutsDir: 'app/views/layouts',
    helpers: hbshelpers,
    extname: '.html',

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
  app.set('view engine', 'html');
  app.engine('html', hbs.engine);
  app.set('showStackError', true)

  // Set up assets folder
  app.use(express.static(config.root + '/public'))
  app.use(morgan())

  // views config
  app.set('views', config.root + '/app/views')



  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
 G E N E R A L   E X P R E S S   C O N F I G U R A T I O N
 *
 * The following section is standard express setup.  the use method create general middlwares
 * in order to handle certain actions. Parsers, Loggers, Session, View directory, Logging
 * @example middlewares, global errors, global parsers
 ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */

  app.use(morgan('dev')); // log every request to the console
  app.use(expressValidator());
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.use(methodOverride(function(req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

  // cookieParser should be above session
  app.use(cookieParser('SECRETOKEN'));

  app.use(session({
    secret: pkg.name,
    resave: true,
    saveUninitialized: true,    
    maxAge: new Date(Date.now() + 3600000),
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }))

  // This allows the PKG and ENV vars to be accessible to controllers and views
  app.use(function(req, res, next) {
    res.locals.pkg = pkg
    res.locals.env = env
    next()
  })

  // View helpers
  app.use(helpers(pkg.name))

  /*
   * Global Error Handlers
   */
  app.use(logErrors)
  app.use(handle500)
  app.use(handle404)

  var env = process.env.NODE_ENV || 'development';
  if ('development' == env || 'staging' == env) {
    app.locals.pretty = true;
  }

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
    if (err.message && (~err.message.toLowerCase().indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next(err)
    }
    // API errors return as JSON.
    if (req.url.indexOf('/api/') == 0) return res.status(500).json({
        status: 500,
        error: err.name,
        message: err.message
      })
      // All other errors return 500 Error Page
    res.status(500).render('500')
  }

  /**
   * 404 Error Handler
   */
  function handle404(err, req, res, next) {
    if (req.url.indexOf('/api/') == 0) return res.status(404).json({
      status: 404,
      error: err.name,
      message: err.message
    })
    res.status(404).render('404', {
      url: req.originalUrl
    })
  }
}