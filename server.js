/**
*
*                         ▗▄▄▄▄▄▄▄▟▄▄▄▄▄▄
*                      ▐██████████████████▙▄▄
*                      ███████████████████████▄
*                     ▐████████████████████████▌
*                     ██████████████████████████
*                    ▐██████████████████████████▌
*                    ███████████████████████████▌
*                   ▗███████████████████████████▀
*                   ▟███████████████████████████████████▄▄▖
*                  ▐████████████████████████████████████████▄
*     ▄            ▟██████████████████████████████████████████▖
*     ▝▙▄▄        ▄▟▄▄▟███████████▀▀▀▀▀▀▀▀▀▜███████████████████
*       ▀███████████████▖▀▛▘▀▀▀▐███         ▝▙▄▟███████████████
*         ▝▀▜███████████▙     ▀███▛▀        ▗▛████████████████▛
*            ▝▀▜████ ▟█▜▜▄    ██▀▀▀▀▚       ▐███████▙▄▝▀██████
*                ▝▀█▖▘    ▘▛   ▝            ▐█▀▜██████▌  ▝███▘
*                   ▘                        ▌   ▝██████▄▄▞▀
*                        ▌▝▀                 ▘▌▝ ▟███████▛▀
*                    ▘   ▗     ▄▘▘▖          ▝  ▗███▀▜███▛▘
*                       ▗▄▟██████▄▟▄         ▖ ▄████▙
*                    ▗▗███████▀▀▀▀▘▝▌        ▝▜████▖▀▚▖
*                    ▝███▙▖▄▄▄▖  ▝▘▄█         ▐███▀▀▘
*                     ▜██▖          █         ▟███▖
*                      ▜██████▄▄▄▄▄▖▀         ▟█▛▜▙
*                       ▜████████▙           ▗███▙▄
*                        ▜█████▖▄    ▄▀▄  ▗▄▟███████▖
*                    ▗▟█▘█▄▛▜▜██▙███▙▟███████████████▙
*                  ▗███▛ ▜███▙▄▄ ▐████████████████████▙▄▄▄
*   ▗▄▄▄▄▄▄▄███▛▀▗▄████▌▗▙█████████████████████████████████▄
*   ▐█▀  ▄▄██▛▀▗▟██████▙████████████████████████████████████▙▖
*    ▐ ▐██▌     ██████████████████████████████████████████████
*    ▝ ▝▀▀▘     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
*                 This boilerplate is protected by:
*    ________               __      _   __                _
*   / ____/ /_  __  _______/ /__   / | / /___  __________(_)____
*  / /   / __ \/ / / / ___/ //_/  /  |/ / __ \/ ___/ ___/ / ___/
* / /___/ / / / /_/ / /__/ ,<    / /|  / /_/ / /  / /  / (__  )
* \____/_/ /_/\__,_/\___/_/|_|  /_/ |_/\____/_/  /_/  /_/____/
* 
* server.js 
* Traackr: Node.js Boilerplate
* https://bitbucket.com/traackr/chuck-node
*
* @copyright  Copyright (c) 2013-2014 Traackr, Inc.
* @author Paul Kist paul@traackr.com
* @description Chuck Norris is awesome and can do anything.  The same can be said of Node.js.  But really, Node.js has got nothing on Chuck Norris.
*
* Server Entry Point
*/
var express = require('express')
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config')[env]
var mongoose = require('mongoose')
var fs = require('fs')

require('express-namespace')
mongoose.connect(config.db)

/*
 * This is where we bootstrap our models.
 * Doing this at startup makes them available to our app early on.
 * 
 * Require is how a file gets loaded into the global scope and can be accessed by the 
 * require command elsewhere in the app
 *
 * The syntax here iterates through each one of the files in the folder
 */
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file)
})

/*
 * Create express
 */
var app = express()

/*
 * Config/express.js is where our express app is set up and configured.
 */
require('./config/express')(app, config);

/*
 * Bootstrap all routes
 */
require('./config/routes')(app)

/*
 * Start the app by listening on <port>
 */
var port = process.env.PORT || 8080
app.listen(port)
console.log('Express app started on port ' + port)

// Expose app
module.exports = app
