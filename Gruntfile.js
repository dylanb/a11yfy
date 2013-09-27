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
            a11yfy: {
                options: {
                    jshintrc: "a11yfy/.jshintrc"
                },
                files: {
                    src: "a11yfy/*.js"
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
        },
        qunit_junit: {
            options: {
            }
        },
        concat: {
            options: {
                separator: ";"
            },
            dist: {
                files: {
                    "dist/jquery.a11yfy.all.js": ["a11yfy/jquery.a11yfy.core.js", "tables/jquery.a11yfy.tables.js"],
                    "dist/jquery.a11yfy.core.css": ["a11yfy/jquery.a11yfy.core.css"],
                    "dist/jquery.a11yfy.tables.js": ["tables/jquery.a11yfy.tables.js"],
                    "dist/jquery.a11yfy.i18n-de.js": ["a11yfy/jquery.a11yfy.i18n-de.js"],
                    "dist/jquery.a11yfy.core.js": ["a11yfy/jquery.a11yfy.core.js"]
                }
            }
        }
    });

    // grunt plugins
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-qunit-junit" );
    grunt.loadNpmTasks( "grunt-contrib-csslint" );
    grunt.loadNpmTasks( "grunt-contrib-cssmin" );
    grunt.loadNpmTasks( "grunt-contrib-watch");
    grunt.loadNpmTasks( "grunt-contrib-connect");
    grunt.loadNpmTasks( "grunt-html" );
    grunt.loadNpmTasks( "grunt-compare-size" );
    grunt.loadNpmTasks( "grunt-git-authors" );


    grunt.registerTask( "lint", [ "jshint"] );
    grunt.registerTask( "test", [ "qunit_junit", "qunit", "coverage_aggregate" ] );
    grunt.registerTask( "server", [ "connect" ] );
    grunt.registerTask( "watcher", [ "watch" ] );
    grunt.registerTask( "build", [ "concat" ] );
    grunt.registerTask( "all", [ "lint", "test", "build" ] );

    grunt.registerTask("coverage_aggregate", "Aggregate coverage reports into report.html", function() {
        var fs = require("fs"),
            data,
            coverageFiles,
            summaryData = {
                lines : 0,
                covered: 0,
                percentage : undefined
            };

        data = fs.readFileSync("report-template.html").toString();
        coverageFiles = fs.readdirSync("coverage");
        coverageFiles.forEach(function(file) {
            var cData = JSON.parse(fs.readFileSync("coverage/" + file));
            summaryData.lines += cData.lines;
            summaryData.covered += cData.covered;
        });
        summaryData.percentage = (summaryData.covered/summaryData.lines)*100;
        data = data.replace(/\{\{lines\}\}/gi, summaryData.lines);
        data = data.replace(/\{\{covered\}\}/gi, summaryData.covered);
        data = data.replace(/\{\{percentage\}\}/gi, summaryData.percentage);
        data = data.replace(/\{\{creationDate\}\}/gi, new Date().toString());
        fs.writeFileSync("report.html", data);
    });

    // listen for events from the report writer
    grunt.event.on('qunit.coverage', function (data) {
        var fs = require("fs");
        try {
            fs.mkdirSync("coverage");
        } catch( err) {}
        fs.writeFileSync("coverage/" + data.a11yfyTestUnit + ".txt", JSON.stringify(data.coverageData));
        console.log("lines : " + data.coverageData.lines + ", covered : " + data.coverageData.covered + ", percentage : " + data.coverageData.percentage + "\n");
    });
};