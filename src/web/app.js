'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const hbs = require('hbs');
const sass = require('express-compile-sass');

const EventEmitter = events.EventEmitter;

const home = require('./app/index');
const config = require('./app/configuration/index');
const google = require('./app/google/index');
const toodledo = require('./app/toodledo/index');

const DEFAULT_HTTP_PORT = 8181;

module.exports = class Application extends EventEmitter {
    constructor(config) {
        super();

        this.config = _.merge({
            'port': DEFAULT_HTTP_PORT
        }, config);

        this.server = express();
        this.server.use(sass({
            'root': __dirname,
            'sourceMap': false,
            'sourceComments': false
        }));
        this.server.use('/bower', express.static(__dirname + '/bower'));
        this.server.use('/assets', express.static(__dirname + '/assets'));
        this.server.set('view engine', 'hbs');
        this.server.set('views', __dirname + '/views');
        hbs.registerPartials( __dirname + '/views/partials');
    }

    init() {
        this.server.use('/', home);
        this.server.use('/configuration', config);
        this.server.use('/google', google);
        this.server.use('/toodledo', toodledo);

        return this;
    }

    start() {
        this.server.listen(this.config.port, () => {
            console.log('we started!');
        });

        return this;
    }
};
