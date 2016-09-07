'use strict';

const hbs = require('hbs');
const moment = require('moment');

hbs.registerHelper('equal', function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

hbs.registerHelper('nequal', function(a, b, opts) {
    if (a === b) {
        return opts.inverse(this);
    }
    return opts.fn(this);
});

hbs.registerHelper('sum', function(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        throw new Exception('Both arguments passed to the "sum" helper must be finite numbers.');
    }
    return a + b;
});

hbs.registerHelper('json', function(object) {
    return JSON.stringify(object, null, 4);
});

hbs.registerHelper('startswith', function(string, value, opts) {
    if (string.search(value) !== 0) {
        return opts.inverse(this);
    }
    return opts.fn(this);
});

hbs.registerHelper('dateFormat', function(timestamp, options) {
    const fmt = options.hash.format || 'MMM Do, YYYY, h:mm:ss a';
    return moment(timestamp).format(fmt);
});

hbs.registerHelper('contains', function(array, value, opts) {
    if (typeof array === 'undefined') {
        return opts.inverse(this);
    }

    if (array.includes(value)) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

hbs.registerHelper('getFrom', function(object, key) {
    if (typeof object === 'undefined') {
        return;
    }

    if (object.hasOwnProperty(key)) {
        return object[key];
    }
    return;
});

hbs.registerHelper('dump', function(object) {
    console.dir(object);
});
