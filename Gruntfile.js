'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concurrent: {
        target: {
			tasks: ['nodemon', 'watch:dev'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
	nodemon: {
	  dev: {
		options: {
		  file: 'app.js',
		  ignoredFiles: ['node_modules/**','public/**','test/**'],
		  watchedExtensions: ['js'],
		  watchedFolders: ['./','src','routes']
		}
	  }
	},
	less: {
	  dev: {
		options: {
			paths: ["public/css","public/bower_components/bootstrap/less"],
			cleancss: true
		},
		files: {
			"public/css/main.min.css": "public/css/main.less"
		}
      }
	},
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dev: {
        src: ['src/**/*.js', 'routes/**/*.js','app.js','public/js/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      dev: {
        files: ['<%= jshint.dev.src %>','public/css/**/*.less'],
        tasks: ['jshint:dev']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task.
  grunt.registerTask('default', ['concurrent']);

};
