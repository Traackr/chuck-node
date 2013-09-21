/**
 * ChuckUtils.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Chuck's Utilities
 */
var crypto = require('crypto')
  , mongoose = require('mongoose')
 

 /**
  * Create a 40 character md5 hash from given input
  * 
  * @param input {String}
  */ 
 exports.md5hash = function(input) {
 	return crypto.createHash('md5').update(input).digest("hex");
 }


 /**
  * Hashes the 
  */
 exports.hashText = function(text) {
  var lower = text.toLowerCase()
 	return this.md5hash(lower);
 }

 /**
  * Returns true if the value is non-null
  * 
  * @param value {String}
  */  
 exports.exists = function(value) {
	return value.toString() && value.toString().length;
 }

 /**
 * Formats mongoose errors into proper array
 *
 * @param {Mixed} errors
 * @return {Array}
 */
exports.errors = function (err) {
  if (err.errors) return err.errors;
  else {
    var errorArray = [];
    errorArray.push(err);
    return errorArray
  }
}