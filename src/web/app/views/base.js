/* global define */
'use strict';

define(['lodash', 'backbone', 'handlebars', 'json!data/sidebar-links.json'], (_, Backbone, Handlebars, SidebarLinks) => {
    const View = Backbone.View.extend();

    View.prototype.isEventListenedTo = function(eventName) {
        return (this._events) ? !!this._events[eventName] : false;
    };

    View.prototype.renderTemplate = function(template, data) {
        const fragment = Backbone.history.getFragment();
        const hbs = Handlebars.compile(template);

        data = data || {};

        _.merge(data, {
            'current-page': `/${ fragment }`,
            'sidebar-links': SidebarLinks
        });

        return hbs(data);
    };

    return View;
});
