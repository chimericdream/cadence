'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const hbs = require('hbs');
const logger = require('winston');
const path = require('path');
const sass = require('express-compile-sass');

const EventEmitter = events.EventEmitter;

const home = require('./views/index');
const admin = require('./views/admin/index');
const contexts = require('./views/contexts/index');

require('../helpers/hbs-helpers');

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
        this.server.set('views', path.join(__dirname, 'templates'));
        hbs.registerPartials(path.join(__dirname, 'templates/partials'));
    }

    init() {
        this.server.use('/', home);
        this.server.use('/admin', admin);
        this.server.use('/contexts', contexts);

        return this;
    }

    start() {
        this.server.listen(this.config.web.port, () => {
            logger.info('web server started!');
        });

        return this;
    }
};
