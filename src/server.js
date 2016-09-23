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

const fsp = require('fs-promise');

const AppConfig = require('./config');
const WebApplication = require('./app');

let localConfig;

const configPromise = fsp.readFile(args.config, 'utf-8')
    .then((data) => {
        localConfig = JSON.parse(data);
        return Promise.resolve();
    })
    .catch(() => {
        localConfig = {};
        return Promise.resolve();
    });

configPromise.then(() => {
    const config = new AppConfig(localConfig);
    const web = new WebApplication(config);

    web.init();
    web.ensureFiles()
        .then(() => {
            web.start();
        });
});
