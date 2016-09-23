'use strict';

const _ = require('lodash');
const express = require('express');
const fsp = require('fs-promise');
const logger = require('winston');
const path = require('path');
const sass = require('express-compile-sass');

const events = require('events');
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
                this.config.sass
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
        this.server.use('/api', api.router);
        this.server.get('/', (request, response) => {
            fsp.readFile('src/index.html')
                .then((html) => {
                    response.set('Content-Type', 'text/html');
                    response.send(html);
                });
        });

        return this;
    }

    ensureFiles() {
        const promises = [];
        api.dataFiles.forEach((file) => {
            promises.push(fsp.ensureFile(file));
        });
        return Promise.all(promises);
    }

    start() {
        this.server.listen(this.config.port, () => {
            logger.info('web server started!');
        });

        return this;
    }
};
