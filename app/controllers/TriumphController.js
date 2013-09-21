/**
 * TriumphController.js 
 * Traackr: chuck-node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Triumph Controller
 */
var mongoose = require('mongoose')
  , Triumph = mongoose.model('Triumph')
  , _ = require('underscore')
  , async = require('async')
  , chuckUtil = require('../lib/ChuckUtils')


/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
   H E L P E R    E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /
/**
 * Used as middlewear to bind actual requested object by ID to request object so its available to other
 * Controller methods
 */
exports.load = function(req, res, next, id){
  Triumph.load(id, function (err, triumph) {
    if (err) return next(err)
    if (!triumph)  {
        return next(new Error('not found'))
    }
    // Put the returned object in the modelHolder
    if (!req.modelHolder) req.modelHolder = {};
    req.modelHolder.triumph = triumph
    next()
  })
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  W E B     E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /


/**
 * Find list of triumphs
 */
exports.index = function(req, res, next){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  /* 
   * This is an example of slightly nested callbacks
   * Anything deeper than this, you should reconsider how you
   * are structuring your code.
   */
  // Get triumphs with pagination limits
  Triumph.list(options, function(err, triumphs) {
    if (err) return next(err)
    // Get count for pagination controls
    Triumph.count().exec(function (err, count) {
      if (err) return next(err)
      // Render response
      res.render('triumphs/index', {
        title: 'Triumphs',
        triumphs: triumphs,
        pagination: {
          page: page + 1,
          pageCount: Math.ceil(count / perPage)
        }
      })
    })
  })  
}

/**
 * New Triumph Action
 */
exports.new = function(req, res){
  res.render('triumphs/new', {
    title: 'What can chuck do?',
    triumph: new Triumph({})
  })
}

/**
 * Create Triumph
 */
exports.create = function (req, res) {
  var triumph = new Triumph(req.body)
  __createTriumph(triumph, function(err) {
    res.render('triumphs/new', {
      title: 'New Triumph',
      triumph: triumph,
      errors: chuckUtil.errors(err)
    })
  }, function(triumph) {
    return res.redirect('/triumphs/'+triumph._id)
  })
}

/**
 * Edit Triumph
 */
exports.edit = function (req, res) {
  res.render('triumphs/edit', {
    title: 'Edit ' + req.modelHolder.triumph.target,
    triumph: req.modelHolder.triumph
  })
}

/**
 * Update Triumph
 *
 * This method makes use of the Underscore library.
 * The extend function maps differences from one object to another
 */
exports.update = function(req, res){
  var triumph = req.modelHolder.triumph
  triumph = _.extend(triumph, req.body)
  triumph.save(function(err) {
    if (!err) {
      return res.redirect('/triumphs/' + triumph._id)
    }
    res.render('triumphs/edit', {
      title: 'Edit Triumph',
      triumph: triumph,
      errors: chuckUtil.errors(err)
    })
  })
}

/*
 * Show Triumph
 */
exports.show = function(req, res){
  res.render('triumphs/show', {
    title: req.modelHolder.triumph.eventType + req.modelHolder.triumph.date,
    triumph: req.modelHolder.triumph
  })
}

/*
 * Delete a Triumph
 */
exports.destroy = function(req, res){
  var triumph = req.modelHolder.triumph
  triumph.remove(function(err){
    res.redirect('/triumphs')
  })
}




/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  JSON API  E N D P O I N T S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /

/** 
 * API Endpoint for Rating a Triumph
 * 
 */
exports.rate = function(req, res, next) {
  var triumph = req.modelHolder.triumph
  triumph.rate(req.body.rateType, function(err) {
   if (err) return next(err);
   else return res.status(200).json({status: 'OK' })
  })
}


/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
  P R I V A T E   M E T H O D S
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** /
/**
 * Private create triumph method
 * This could be used in case there was an API method that did the same thing as the web method,
 * the actual create functionality can be re-used.
 */
function __createTriumph(triumph, errorCallback, successCallback) {
  triumph.save(function (err) {
  if (!err) {
    successCallback(triumph);
  } else {
    errorCallback(err);
  }
  })  
}