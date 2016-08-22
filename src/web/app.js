'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const hbs = require('hbs');
const logger = require('winston');
const path = require('path');
const sass = require('express-compile-sass');

const EventEmitter = events.EventEmitter;

const home = require('./app/index');
const config = require('./app/configuration/index');
const google = require('./app/google/index');
const toodledo = require('./app/toodledo/index');

module.exports = class WebApplication extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;

        this.server = express();
        this.server.use(sass(
            _.merge(
                {'root': __dirname},
                this.config.web.sass
            )
        ));
        this.server.use(
            '/bower',
            express.static(path.join(__dirname, 'bower'))
        );
        this.server.use(
            '/assets',
            express.static(path.join(__dirname, 'assets'))
        );
        this.server.set('view engine', 'hbs');
        this.server.set('views', path.join(__dirname, 'views'));
        hbs.registerPartials(path.join(__dirname, 'views/partials'));
    }

    init() {
        this.server.use('/', home);
        this.server.use('/configuration', config);
        this.server.use('/google', google);
        this.server.use('/toodledo', toodledo);

        return this;
    }

    start() {
        this.server.listen(this.config.web.port, () => {
            logger.info('web server started!');
        });

        return this;
    }
};
