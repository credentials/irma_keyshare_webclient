module.exports = function (grunt) {
    // Setup urls for the keyshare server, api server, and irma_js
    // these are used to configure the webclient
    var keyshare_server_url, scheme_manager_name, scheme_manager_url, api_server_url, api_web_url, irma_js_url;
    if ( typeof(grunt.option("keyshare_server_url")) === "undefined") {
        console.log("INFO: set keyshare_server_url to create a working setup");
    }
    if ( typeof(grunt.option("scheme_manager_name")) === "undefined") {
        console.log("INFO: set scheme_manager_name to create a working setup");
    }
    if ( typeof(grunt.option("scheme_manager_url")) === "undefined") {
        console.log("INFO: set scheme_manager_url to create a working setup");
    }
    if ( (typeof(grunt.option("api_server_url")) === "undefined") ) {
        console.log("INFO: set api_server_url (possibly also irma_js_url) to enable email issuing");
    }

    keyshare_server_url = grunt.option("keyshare_server_url");
    scheme_manager_name = grunt.option("scheme_manager_name");
    scheme_manager_url = grunt.option("scheme_manager_url");
    api_server_url = grunt.option("api_server_url") + "/api/v2/";
    api_web_url = grunt.option("api_web_url") || grunt.option("api_server_url");
    api_web_url += "/server/";
    irma_js_url = grunt.option("irma_js_url") || grunt.option("api_server_url");
    irma_js_url += "/client/";


    console.log("keyshare server url:", keyshare_server_url);
    console.log("scheme manager name:", scheme_manager_name);
    console.log("scheme manager url:", scheme_manager_url);
    console.log("api_server_url:", api_server_url);
    console.log("api_web_url:", api_web_url);
    console.log("irma_js_url:", irma_js_url);

    grunt.initConfig({
        copy: {
            // Copying the bower bundles is a bit of a hack
            bower_bundle: {
                cwd: "bower_components",
                src: ["**/*"],
                dest: "build/bower_components",
                expand: "true",
            },
            examples: {
                cwd: "src",
                src: ["**/*", "!**/*.html"],
                dest: "build/",
                expand: "true",
            },
        },
        "string-replace": {
            examples: {
                files: [{
                    cwd: "./src",
                    src: ["**/*.html"],
                    dest: "build/",
                    expand: "true",
                }],
                options: {
                    replacements: [{
                        pattern: /\[KEYSHARE_SERVER_URL\]/g,
                        replacement: keyshare_server_url,
                    }, {
                        pattern: /\[SCHEME_MANAGER_NAME\]/g,
                        replacement: scheme_manager_name,
                    }, {
                        pattern: /\[SCHEME_MANAGER_URL\]/g,
                        replacement: scheme_manager_url,
                    }, {
                        pattern: /\[API_SERVER_URL\]/g,
                        replacement: api_server_url,
                    }, {
                        pattern: /\[API_WEB_URL\]/g,
                        replacement: api_web_url,
                    }, {
                        pattern: /\[IRMA_JS_URL\]/g,
                        replacement: irma_js_url,
                    },
                  ],
                },
            },
        },
        watch: {
            webfiles: {
                files: [
                    "./src/**/*",
                    "!./src/**/*.html",
                ],
                tasks: ["copy"],
            },
            htmlfiles: {
                files: [
                    "./src/**/*.html",
                ],
                tasks: ["string-replace"],
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-string-replace");

    grunt.registerTask("default", ["copy", "string-replace", "watch"]);
    grunt.registerTask("build", ["copy", "string-replace"]);
};
