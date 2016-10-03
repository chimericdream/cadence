'use strict';

const allTestFiles = [];
const TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach((file) => {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        const normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(`../../../${ normalizedTestModule }`);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    'baseUrl': '/base/src/web/app',

    'paths': {
        'backbone': '../bower/backbone/backbone-min',
        'bootstrap': '../bower/bootstrap/dist/js/bootstrap.min',
        'chartjs': '../bower/chart.js/dist/Chart',
        'handlebars': '../bower/handlebars/handlebars.amd.min',
        'ictus': '../bower/ictus/dist/js/ictus',
        'js-cookie': '../bower/js-cookie/src/js.cookie',
        'json': '../bower/requirejs-plugins/src/json',
        'jquery': '../bower/jquery/dist/jquery.min',
        'lodash': '../bower/lodash/dist/lodash.min',
        'moment': '../bower/moment/min/moment.min',
        'notifyjs': '../bower/notifyjs/dist/notify',
        'tether': '../bower/tether/dist/js/tether.min',
        'text': '../bower/text/text',
        'underscore': '../bower/underscore/underscore-min'
    },

    // dynamically load all test files
    'deps': allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    'callback': window.__karma__.start
});
