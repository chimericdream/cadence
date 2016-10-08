/* global define */
'use strict';

define([
    'backbone.radio',
    'marionette',
    'views/sidebar',
    'text!templates/site.hbs'
], (
    Radio,
    Marionette,
    SidebarView,
    SiteTemplate
) => {
    const SiteView = Marionette.View.extend({
        'template': SiteTemplate,
        'regions': {
            'content': '#main-content',
            'sidebar': '#main-sidebar'
        }
    });

    SiteView.prototype.initialize = function() {
        const channel = Radio.channel('rendering');
        channel.on('render:view:request', function(data) {
            this.showChildView('content', new data.view());
        }.bind(this));
    };

    SiteView.prototype.onRender = function() {
        this.showChildView('sidebar', new SidebarView());
    };

    return SiteView;
});
