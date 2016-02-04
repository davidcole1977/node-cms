module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'js-modules/**/*.js', 'browser-js/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['browser-js/**/*.js'],
      tasks: ['browserify:dev']
    },
    browserify: {
      dev: {
        files: {
          'public_html/assets/js/edit-chunk-definition.js': ['browser-js/edit-chunk-definition.js'],
          'public_html/assets/js/edit-chunk.js': ['browser-js/edit-chunk.js'],
          'public_html/assets/js/list-chunk-definitions.js': ['browser-js/list-chunk-definitions.js'],
          'public_html/assets/js/list-chunks.js': ['browser-js/list-chunks.js']
        }
      }
    },
    mochaTest: {
      dev: {
        options: {
          reporter: 'spec',
          clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false) 
        },
        src: ['test/**/*.spec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['browserify:dev', 'watch']);
  grunt.registerTask('test', ['mochaTest:dev']);

};