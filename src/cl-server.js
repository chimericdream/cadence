'use strict';

//const args = require('yargs')
//    .usage('$0 [args]')
//    .option('config', {
//        alias: 'c',
//        describe: 'the path to your configuration file'
//    })
//    .option('logfile', {
//        alias: 'l',
//        describe: 'specify a path to a log file'
//    })
//    .demand(['config'])
//    .help()
//    .alias('help', 'h')
//    .argv;
//
//const fs = require('fs');
//const logger = require('winston');
//const config = JSON.parse(fs.readFileSync(args.config, 'utf-8'));
//
//logger.info('src: testing');

const Application = require('./web/app');

const app = new Application();

app.init().start();
