/**
 * BitlyService.js
 * Traackr: chuck-node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Bit.ly API Integration
 */
var querystring = require('querystring'),
https = require('https'),
env = process.env.NODE_ENV || 'development',
config = require('../../config/config')[env]

/**
 * Gets shortened URL from the bitly API
 *
 */
exports.getShortUrl = function(id, cb) {
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