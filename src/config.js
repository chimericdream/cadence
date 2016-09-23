'use strict';

const _ = require('lodash');
const proxy = require('proxy-mate');

const DEFAULT_HTTP_PORT = 8181;

module.exports = class Configuration {
    get defaults() {
        return {
            'port': DEFAULT_HTTP_PORT,
            'sass': {
                'sourceMap': false,
                'sourceComments': false
            }
        };
    };

    constructor(options) {
        this.localConfig = _.merge(this.defaults, options);

        return proxy(this, [], ['localConfig']);
    }
};
