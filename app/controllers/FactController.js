/**
 * FactController.js
 * Traackr: chuck-node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Fact Controller
 */
var mongoose = require('mongoose'),
   Fact = mongoose.model('Fact'),
   _ = require('underscore'),
   async = require('async'),
   chuckUtil = require('../lib/ChuckUtils'),
   querystring = require('querystring'),
   https = require('https'),
   env = process.env.NODE_ENV || 'development',
   config = require('../../config/config')[env]



/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
   H E L P E R    E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /
/**
 * Used as middlewear to bind actual requested object by ID to request object so its available to other
 * Controller methods
 */
exports.load = function(req, res, next, id) {
   Fact.load(id, function(err, fact) {
      if (err) return next(err)
      if (!fact) {
         return next(new Error('not found'))
      }
      // Put the returned object in the modelHolder
      if (!req.modelHolder) req.modelHolder = {};
      req.modelHolder.fact = fact
      next()
   })
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  W E B     E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /


/**
 * Find list of facts
 */
exports.index = function(req, res, next) {
   var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
   var perPage = 30
   var options = {
      perPage: perPage,
      page: page
   }

   /* 
    * @example This is an example of slightly nested callbacks
    * Anything deeper than this, you should reconsider how you
    * are structuring your code.
    */
   // Get facts with pagination limits
   Fact.list(options, function(err, facts) {
      if (err) return next(err)
         // Get count for pagination controls
      Fact.count().exec(function(err, count) {
         if (err) return next(err)
            // Render response
         res.render('facts/index', {
            title: 'Facts',
            facts: facts,
            pagination: {
               page: page + 1,
               pageCount: Math.ceil(count / perPage)
            }
         })
      })
   })
}

/**
 * New Fact Action
 */
exports.new = function(req, res) {
   res.render('facts/new', {
      title: 'What can chuck do?',
      fact: new Fact({})
   })
}

/**
 * Create Fact
 */
exports.create = function(req, res) {
   var fact = new Fact(req.body)
   __createFact(fact, function(err) {
      res.render('facts/new', {
         title: 'New Fact',
         fact: fact,
         errors: chuckUtil.errors(err)
      })
   }, function(fact) {
      return res.redirect('/')
   })
}

/**
 * Edit Fact
 */
exports.edit = function(req, res) {
   res.render('facts/edit', {
      title: 'Edit ' + req.modelHolder.fact.target,
      fact: req.modelHolder.fact
   })
}

/**
 * Update Fact
 *
 * @example This method makes use of the Underscore library.
 * The extend function maps differences from one object to another
 */
exports.update = function(req, res) {
   var fact = req.modelHolder.fact
   fact = _.extend(fact, req.body)
   fact.save(function(err) {
      if (!err) {
         return res.redirect('/facts/' + fact._id)
      }
      res.render('facts/edit', {
         title: 'Edit Fact',
         fact: fact,
         errors: chuckUtil.errors(err)
      })
   })
}

/*
 * Show Fact
 */
exports.show = function(req, res) {
   res.render('facts/show', {
      title: req.modelHolder.fact.eventType + req.modelHolder.fact.date,
      fact: req.modelHolder.fact
   })
}

/*
 * Delete a Fact
 */
exports.destroy = function(req, res) {
   var fact = req.modelHolder.fact
   fact.remove(function(err) {
      res.redirect('/facts')
   })
}



/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  JSON API  E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /

/** 
 * API Endpoint for Rating a Fact
 * 
 */
exports.rate = function(req, res, next) {
   var fact = req.modelHolder.fact
   fact.rate(req.body.rateType, function(err) {
      if (err) return next(err);
      else return res.status(200).json({
         status: 'OK'
      })
   })
}


exports.tinyUrl = function(req, res) {
   var options = {
      perPage: 100,
      page: 0
   }
   Fact.list(options, function(err, facts) {
      console.log(facts)
      async.eachSeries(facts, function(fact, cb) {
         __getShortUrl(fact._id, function(err, url) {
            fact.tinyUrl = url;
            fact.save(function(err) {
               cb(err);
            })
         })
      }, function(err) {
         console.log("All Done")
         return res.status(200).json({ status : 'OK' })
      })
   });
}
/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  P R I V A T E   M E T H O D S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /
/**
 * Private create fact method
 * This could be used in case there was an API method that did the same thing as the web method,
 * the actual create functionality can be re-used.
 */
function __createFact(fact, errorCallback, successCallback) {
   fact.save(function(err, newFact) {
      if (!err) {
         var id = newFact._id;
         __getShortUrl(id, function(err, tinyUrl) {
            newFact.tinyUrl = tinyUrl;
            newFact.save(function(err, newFact) {
               if (err) {
                  errorCallback(err);
               } else {
                  successCallback(newFact);
               }
            })
         })
      } else {
         errorCallback(err);
      }
   })
}


/**
 * Gets shortened URL from the bitly API
 *
 */
function __getShortUrl(id, cb) {
   var options = {
      host: 'api-ssl.bitly.com',
      path: '/v3/shorten?access_token=' + config.bitly_access_token + '&longUrl=' + config.host + '/' + id,
      method: 'GET',
      port: 443,
      headers: {
         'Content-Type': 'application/json'
      }
   };

   https.globalAgent.options.secureProtocol = 'SSLv3_method';
   var req = https.request(options, function(res) {
      res.setEncoding('utf-8');
      var responseString = '';

      res.on('data', function(data) {
         responseString += data;
      });

      res.on('end', function() {
         console.log(responseString);
         var responseObject = JSON.parse(responseString);
         console.log(responseObject);
         cb(null, responseObject.data.url)
      });
   });
   req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      cb(err, null);
   });
   req.end();
}