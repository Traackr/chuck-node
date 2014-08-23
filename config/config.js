/*!
 * Module dependencies.
 */

var path = require('path')
var rootPath = path.resolve(__dirname + '../..')

/**
 * Expose config
 */

module.exports = {
   development: {
      root: rootPath,
      db: 'mongodb://localhost/chuck_dev',
      user: 'admin',
      pass: 'password',
      bitly_access_token: 'YOUR_TOKEN',
      host: 'http://127.0.0.1:8080'
   },
   test: {
      root: rootPath,
      db: 'mongodb://localhost/chuck_test',
      user: 'admin',
      pass: 'password',
      bitly_access_token: 'YOUR_TOKEN',
      host: 'http://127.0.0.1:8080'
   },
   staging: {
      root: rootPath,
      db: process.env.MONGOHQ_URL,
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
      bitly_access_token: process.env.BITLY_TOKEN,
      host: process.env.HOST
   },
   production: {
      root: rootPath,
      db: process.env.MONGOHQ_URL,
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
      bitly_access_token: process.env.BITLY_TOKEN,
      host: process.env.HOST
   }
}