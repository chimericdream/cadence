'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const logger = require('winston');

const EventEmitter = events.EventEmitter;

const google = require('./google/index');
const toodledo = require('./toodledo/index');

const DEFAULT_HTTP_PORT = 8282;

module.exports = class ApiApplication extends EventEmitter {
    constructor(config) {
        super();

        this.config = _.merge({'port': DEFAULT_HTTP_PORT}, config);

        this.server = express();
    }

    init() {
        this.server.use('/google', google);
        this.server.use('/toodledo', toodledo);

        return this;
    }

    start() {
        this.server.listen(this.config.port, () => {
            logger.info('API started!');
        });

        return this;
    }
};
