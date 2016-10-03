'use strict';

module.exports = (config) => {
    config.set({
        'basePath': '',

        'frameworks': ['mocha', 'requirejs', 'chai', 'sinon'],

        'files': [
            {'pattern': 'src/web/bower/backbone/backbone-min.js', 'included': false},
            {'pattern': 'src/web/bower/bootstrap/dist/js/bootstrap.min.js', 'included': false},
            {'pattern': 'src/web/bower/chart.js/dist/Chart.js', 'included': false},
            {'pattern': 'src/web/bower/handlebars/handlebars.amd.min.js', 'included': false},
            {'pattern': 'src/web/bower/ictus/dist/js/ictus.js', 'included': false},
            {'pattern': 'src/web/bower/js-cookie/src/js.cookie.js', 'included': false},
            {'pattern': 'src/web/bower/requirejs-plugins/src/json.js', 'included': false},
            {'pattern': 'src/web/bower/jquery/dist/jquery.min.js', 'included': false},
            {'pattern': 'src/web/bower/lodash/dist/lodash.min.js', 'included': false},
            {'pattern': 'src/web/bower/moment/min/moment.min.js', 'included': false},
            {'pattern': 'src/web/bower/notifyjs/dist/notify.js', 'included': false},
            {'pattern': 'src/web/bower/tether/dist/js/tether.min.js', 'included': false},
            {'pattern': 'src/web/bower/text/text.js', 'included': false},
            {'pattern': 'src/web/bower/underscore/underscore-min.js', 'included': false},

            {'pattern': 'src/web/app/**/*', 'included': false},
            {'pattern': 'test/web/app/**/*.spec.js', 'included': false},

            'test/test-main.js'
        ],

        'exclude': [],

        'preprocessors': {
            'src/web/app/**/*.js': ['coverage']
        },

        'coverageReporter': {
            'dir': 'docs/coverage'
        },

        'reporters': ['progress', 'coverage'],

        'port': 9876,
        'colors': true,
        'autoWatch': true,
        'browsers': ['Chrome'],
        'singleRun': false,
        'concurrency': Infinity,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        'logLevel': config.LOG_INFO
    })
};
