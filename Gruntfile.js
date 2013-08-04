module.exports = function(grunt) {
  // Do grunt-related things in here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
            accessibleDataTable: {
                options: {
                    jshintrc: "accessibleDataTable/.jshintrc"
                },
                files: {
                    src: "accessibleDataTable/*.js"
                }
            },
            tests: {
                options: {
                    jshintrc: ".jshintrc"
                },
                files: {
                    src: "tests/unit/**/*.js"
                }
            }
        }
    });

    // grunt plugins
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-contrib-csslint" );
    grunt.loadNpmTasks( "grunt-contrib-cssmin" );
    grunt.loadNpmTasks( "grunt-html" );
    grunt.loadNpmTasks( "grunt-compare-size" );
    grunt.loadNpmTasks( "grunt-git-authors" );


    grunt.registerTask( "lint", [ "jshint"] );
};