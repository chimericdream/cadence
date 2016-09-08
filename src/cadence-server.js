'use strict';

const args = require('yargs')
    .usage('$0 [args]')
    .option('localConfig', {
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

const AppConfig = require('./config');
const WebApplication = require('./web/app');
const ApiApplication = require('./api/app');

let localConfig;

if (typeof args.config !== 'undefined') {
    // eslint-disable-next-line no-sync
    localConfig = JSON.parse(fs.readFileSync(args.config, 'utf-8'));
} else {
    localConfig = {};
}

const config = new AppConfig(localConfig);
const web = new WebApplication(config);
const api = new ApiApplication(config);

web.init().start();
api.init().start();
