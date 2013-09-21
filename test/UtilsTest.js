/**
 * UtilsTest.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Mocha Tests for Utils
 */
var should = require('should')
var assert = require("assert")
var ChuckUtils = require("../app/lib/ChuckUtils")


/* 
 * Classic setup
 *
 * presence of done() allows for async setup
 */
before(function (done) {
  // clear db and other stuff
  console.log("Setting up our Chuck Norris Tests");
  done()
})

describe.skip('Skipped Test', function () {
  describe('This is an example of a skipped test', function () {
    it('Shouldn\'t do anything', function (done) {
      // fill the test
      done()
    })
  })
})

/**
 * Suite of tests for ChuckUtils.js
 */
describe('ChuckUtils Tests', function(){
  describe('#hashText() Tests.  hashText is a case insensitive hashing function used to preserve uniqueness of submitted text.', function() {
    var testText = 'Our Main Test'
    var hashedTest = ChuckUtils.hashText(testText); 

    // Test 1. Case sensitive   
    it('Should be case insensitive', function(){
      var test1 = "our MaiN test";
      var testHash1 = ChuckUtils.hashText(test1);
      testHash1.should.equal(hashedTest);
    })
    // Test 2. Uniqueness test
    it('Should be unique', function(){
      var hashedTest = ChuckUtils.hashText(testText);
      var test1 = "our OTHER test";
      var testHash1 = ChuckUtils.hashText(test1);
      testHash1.should.not.equal(hashedTest);
    })    
  })
})


/* 
 * Classic teardown
 *
 * presence of done() allows for async setup
 */
after(function (done) {
  // do some stuff
  console.log("Tearing down our Chuck Norris Tests");  
  done()
})
