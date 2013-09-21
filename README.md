# Chuck Node: A Node.js Boilerplate

Chuck Norris is awesome and can do anything.  The same can be said of Node.js.  But really, Node.js has got nothing on Chuck Norris.

## What's here?
There are examples in this boiler plate to get started with:

 - NPM / Package.json: [https://npmjs.org/](https://npmjs.org/)
 - Basic MVC Structure
 - Express: [http://expressjs.com/](http://expressjs.com/)
    - Routing
    - Middlewares
    - Views
 - Handlebars: [http://handlebarsjs.com/](http://handlebarsjs.com/)
    - Handlebar Helpers methods
 - Mongoose: [http://mongoosejs.com/](http://mongoosejs.com/)
    - Validation
    - Custom getters and setters
    - Virtual fields
    - Static Methods
    - Instance Methods
    - Schema definitions
    - DB action hooks
 - Grunt (A build tool) [http://gruntjs.com/](http://gruntjs.com/)
 - Mocha (Unit Tests) [http://visionmedia.github.io/mocha/](http://visionmedia.github.io/mocha/)
 - Other Conventions / Tools
    - Async [https://github.com/caolan/async](https://github.com/caolan/async)
    - Underscore [http://underscorejs.org/](http://underscorejs.org/)
    - Crypto [http://nodejs.org/api/crypto.html](http://nodejs.org/api/crypto.html)
- Coming Soon:
    - Forever (Continuious uptime)
    - Mock Unit Testing

## Requirements and Installation

__Tested on Node 0.10.7, NPM 1.2.21__

### Requirements
 - NodeJS & NPM
 - MongoDB
 - Grunt (`npm install -g grunt-cli; npm install -g grunt`)

### Installation

After cloning the project for the first time you'll want to update your project dependencies by running npm install in your home directory by doing:

    $ (sudo) npm install

If this is successful, continue on by running the unit tests and building the app.  Currently there are no files to build at the moment and no build tasks have been set up.  But testing is part of the build process so simply run:

    $ grunt

And the default task will run the unit tests, both the `spec` and `nyan` versions of the test (these are different reporters).  Actualy because the spec version of the suite ran all the tests, there's no use to run the rest under nyan.  But this is an example that you can single out certain tests to run under different reporters, see the grunt configuration `Gruntfile`


## Running the App

In our `package.json` which is native to NPM, we have a few tasks defined:

      "scripts": {
        "start": "NODE_PATH=./app/controllers NODE_ENV=development ./node_modules/.bin/nodemon server.js",
      "test": "NODE_PATH=./app/controllers NODE_ENV=test mocha"
      }
      
So to run the app simply use `npm start` and it will run on port 3000 by default

## Getting Started On Your App

The app is structured as follows.  Under the `app` folder are the following directories and their purpose:

 - `model` - Schema definitions are here.  Look at `Triumphs.js` as an example
 - `controllers` - Controller classes are here.  Look at `TriumphController.js` as an example
 - `views` - Handlebar templates go here.  Look at `views/triumph` for examples
 - `lib` - Custom business logic an go here in an organized fashion and included in your main controller via `require`
 - `lib/HandlebarHelpers.js` - here is where you wanna create your own handlebar functions to be used in your templates
 
    
The files you'll wanna update:
    
 - Edit the main view templates:
    -  `layouts/default.hbs`
    - `partials/*.hbs `   
 - Add routes to config/routes.js
 - Create your Model and Controllers
 - Create your views
