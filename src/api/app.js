'use strict';

const _ = require('lodash');
const express = require('express');
const events = require('events');
const logger = require('winston');

const EventEmitter = events.EventEmitter;

const contexts = require('./contexts/index');
const google = require('./google/index');
const toodledo = require('./toodledo/index');

module.exports = class ApiApplication extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;

        this.server = express();
    }

    init() {
        this.server.use('/contexts', contexts);
        this.server.use('/google', google);
        this.server.use('/toodledo', toodledo);

        return this;
    }

    start() {
        this.server.listen(this.config.api.port, () => {
            logger.info('API started!');
        });

        return this;
    }
};
