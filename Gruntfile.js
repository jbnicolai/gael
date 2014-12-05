module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-simple-mocha");

  grunt.initConfig({

    env: {
      ci: { NODE_ENV: "ci" }
    , test: { NODE_ENV: "test" }
    }

  , watch: {

      unit: {
        files: [ "test/unit/**/*", "lib/**/*" ]
      , tasks: [ "unit" ]
      }
    
    , integration: {
        files: [ "test/integration/**/*", "lib/**/*" ]
      , tasks: [ "integration" ]
      }
    }

  , simplemocha: {
      options: {
        globals   : [ "should" ]
      , reporter  : "spec"
      , ui        : "bdd"
      , growl     : true
      , recursive : true
      , timeout   : 10000
      }
    , unit        : [ "test/unit/**/*.js" ]
    , integration : [ "test/integration/**/*.js" ]
    }
  });

  grunt.registerTask("ci",          [ "env:ci",   "simplemocha" ]);
  grunt.registerTask("test",        [ "env:test", "simplemocha" ]);
  grunt.registerTask("unit",        [ "env:test", "simplemocha:unit" ]);
  grunt.registerTask("integration", [ "env:test", "simplemocha:integration" ]);
  grunt.registerTask("default",     [ "test" ]);
};

