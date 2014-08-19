/**
 * FactFinder.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Finds a random fact
 */
var mongoose = require('mongoose')
  , Fact = mongoose.model('Fact')
  , async = require('async')


/**
 * Returns a random fact from the database
 * This function highlights the use of async waterfall, if you want to chain asynchronous commands,
 * so you don't end up in the depths of nested callback hell
 *
 * For more about async @see https://github.com/caolan/async
 * @param {Function} callback ( @param {Object} err, @param {Object} triump)
 * @example using async waterfall to aviod nested callbacks
 */
exports.findRandomFact = function(cb) {
	async.waterfall([
		// First function gets the count of facts
	  function(callback) {
    	Fact.count({}, function(err, count) {
				if (err) callback(err, null);
				else callback(null,count);
			})
	  },
	    // Second function finds a random number
	  function(count, callback){  
			var rand = Math.floor(Math.random()*count)
			callback(null,rand)
	  },
	  
	  // Third function finds a random triupmph based on the the random number as an offset
	  function(index, callback) {
 			var options = {
		    	perPage: 1,
		    	page: index
		  	}
			Fact.list(options, function(err, facts) {
				if (err) callback(err, null);
				else callback(null, facts);
			})
	  }
	], function (err, facts) {
		cb(err, (facts.length && facts.length > 0) ? facts[0] : {});
	});
}