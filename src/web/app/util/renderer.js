/* global define */
'use strict';

define(['lodash', 'backbone', 'marionette', 'handlebars'], (_, Backbone, Marionette, Handlebars) => {
    Marionette.Renderer.render = function(template, data) {
        const fragment = Backbone.history.getFragment();
        const hbs = Handlebars.compile(template);

        data = data || {};

        _.merge(data, {'current-page': `/${ fragment }`});

        return hbs(data);
    };
});
