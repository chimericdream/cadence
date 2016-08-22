'use strict';

const _ = require('lodash');
const proxy = require('proxy-mate');

const DEFAULT_WEB_HTTP_PORT = 8181;
const DEFAULT_API_HTTP_PORT = 8282;

module.exports = class Configuration {
    get defaults() {
        return {
            'api': {
                'port': DEFAULT_API_HTTP_PORT
            },
            'web': {
                'port': DEFAULT_WEB_HTTP_PORT,
                'sass': {
                    'sourceMap': false,
                    'sourceComments': false
                }
            },
            'adapters': {
                'google': {},
                'toodledo': {}
            }
        };
    };

    constructor(options) {
        this.localConfig = _.merge(this.defaults, options);

        return proxy(this, [], ['localConfig']);
    }
};
