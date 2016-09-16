'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const fs = require('fs');
const logger = require('winston');
const path = require('path');
const sass = require('express-compile-sass');

const EventEmitter = events.EventEmitter;

const api = require('./api/main');

module.exports = class WebApplication extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;

        this.server = express();
        this.server.use(sass(
            _.merge(
                {'root': path.join(__dirname, 'web')},
                this.config.web.sass
            )
        ));
        this.server.use(
            '/bower',
            express.static(path.join(__dirname, 'web/bower'))
        );
        this.server.use(
            '/assets',
            express.static(path.join(__dirname, 'web/assets'))
        );
        this.server.use(
            '/app',
            express.static(path.join(__dirname, 'web/app'))
        );
    }

    init() {
        this.server.use('/api', api);
        this.server.get('/', (request, response) => {
            const html = fs.readFileSync('src/index.html');
            response.set('Content-Type', 'text/html');
            response.send(html);
        });

        return this;
    }

    start() {
        this.server.listen(this.config.web.port, () => {
            logger.info('web server started!');
        });

        return this;
    }
};
