module.exports = function(grunt) {
  // Do grunt-related things in here
    function expandFiles( files ) {
        return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
            return values[ 0 ];
        });
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            tables: {
                options: {
                    jshintrc: "tables/.jshintrc"
                },
                files: {
                    src: "tables/*.js"
                }
            },
            tests: {
                options: {
                    jshintrc: "tests/.jshintrc"
                },
                files: {
                    src: "tests/unit/**/*.js"
                }
            }
        },
        qunit: {
            files: expandFiles( "tests/unit/**/*.html" ).filter(function( file ) {
                // disabling everything that doesn't (quite) work with PhantomJS for now
                // TODO except for all|index|test, try to include more as we go
                return !( /(all)\.html$/ ).test( file );
            })
        },
        watch: {
            files: ["tables/*.js"],
            tasks: ["jshint"]
        },
        connect: {
            server: {
                options: {
                    hostname: "0.0.0.0",
                    port: 9876,
                    base: "."
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
    grunt.loadNpmTasks( "grunt-contrib-watch");
    grunt.loadNpmTasks( "grunt-contrib-connect");
    grunt.loadNpmTasks( "grunt-html" );
    grunt.loadNpmTasks( "grunt-compare-size" );
    grunt.loadNpmTasks( "grunt-git-authors" );


    grunt.registerTask( "lint", [ "jshint"] );
    grunt.registerTask( "test", [ "qunit" ] );
    grunt.registerTask( "server", [ "connect" ] );
    grunt.registerTask( "watcher", [ "watch" ] );
};