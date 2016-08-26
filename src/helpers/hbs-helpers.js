'use strict';

const hbs = require('hbs');

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

hbs.registerHelper('contains', function(array, value, opts) {
    if (array.includes(value)) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});
