/* global define */
'use strict';

define([
    'backbone.radio',
    'views/base',
    'views/sidebar',
    'text!templates/site.hbs'
], (
    Radio,
    BaseView,
    SidebarView,
    SiteTemplate
) => {
    const SiteView = BaseView.extend({
        'template': SiteTemplate,
        'regions': {
            'content': '#main-content',
            'sidebar': '#main-sidebar'
        }
    });

    SiteView.prototype.initialize = function() {
        const channel = Radio.channel('rendering');
        channel.on('render:view:request', function(data) {
            let view = new data.view();
            view.setTemplateData(data.context);

            this.showChildView('content', view);
            this.showChildView('sidebar', new SidebarView());
        }.bind(this));
    };

    SiteView.prototype.onRender = function() {
        this.showChildView('sidebar', new SidebarView());
    };

    return SiteView;
});
