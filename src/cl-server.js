'use strict';

const args = require('yargs')
    .usage('$0 [args]')
    .option('config', {
        'alias': 'c',
        'describe': 'the path to your configuration file'
    })
    .option('logfile', {
        'alias': 'l',
        'describe': 'specify a path to a log file'
    })
    .help()
    .alias('help', 'h')
    .argv;

// eslint-disable-next-line id-length
const fs = require('fs');

let config;

if (typeof args.config !== 'undefined') {
    // eslint-disable-next-line no-sync
    config = JSON.parse(fs.readFileSync(args.config, 'utf-8'));
}

const WebApplication = require('./web/app');
const ApiApplication = require('./api/app');

const web = new WebApplication(config.web);
const api = new ApiApplication(config.api);

web.init().start();
api.init().start();
