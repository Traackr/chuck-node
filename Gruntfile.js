/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
  env : {
    options : {
    },
    dev : {
      NODE_ENV : 'development',
      NODE_PATH : './app/controllers'
    },
  },
  // SPEC version of our tests
  mochaTest: { 
    test: {
      options: {
        reporter : 'spec',
        timeout : 20000,
      },
      src: ['./test/*.js']
    },
    // NYAN version of our tests
    nyanTest: {
      options: {
        reporter : 'nyan',
        timeout : 20000,
      },
      src: ['./test/*.js']
    }    
  }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('default', ['env:dev', 'mochaTest:test', 'mochaTest:nyanTest']);
};
