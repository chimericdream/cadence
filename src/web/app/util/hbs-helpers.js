'use strict';

define(['handlebars', 'moment'], (Handlebars, moment) => {
    Handlebars.registerHelper('equal', function(a, b, opts) {
        if (a === b) {
            return opts.fn(this);
        }
        return opts.inverse(this);
    });

    Handlebars.registerHelper('nequal', function(a, b, opts) {
        if (a === b) {
            return opts.inverse(this);
        }
        return opts.fn(this);
    });

    Handlebars.registerHelper('sum', function(a, b) {
        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            throw new Exception('Both arguments passed to the "sum" helper must be finite numbers.');
        }
        return a + b;
    });

    Handlebars.registerHelper('json', function(object) {
        return JSON.stringify(object, null, 4);
    });

    Handlebars.registerHelper('startswith', function(string, value, opts) {
        if (string.search(value) !== 0) {
            return opts.inverse(this);
        }
        return opts.fn(this);
    });

    Handlebars.registerHelper('dateFormat', function(timestamp, options) {
        const fmt = options.hash.format || 'MMM Do, YYYY, h:mm:ss a';
        return moment(timestamp).format(fmt);
    });

    Handlebars.registerHelper('contains', function(array, value, opts) {
        if (typeof array === 'undefined') {
            return opts.inverse(this);
        }

        if (array.includes(value)) {
            return opts.fn(this);
        }
        return opts.inverse(this);
    });

    Handlebars.registerHelper('getFrom', function(object, key) {
        if (typeof object === 'undefined') {
            return;
        }

        if (object.hasOwnProperty(key)) {
            return object[key];
        }
        return;
    });

    Handlebars.registerHelper('dump', function(object) {
        console.dir(object);
    });
});
