/* global define */
'use strict';

define(['views/base', 'text!templates/index.hbs'], (BaseView, DashboardTemplate) => {
    const DashboardView = BaseView.extend({
        'events': {
            'click #db-add-widget': 'addWidget'
        }
    });

    DashboardView.prototype.addWidget = function(event) {
        event.preventDefault();
        event.stopPropagation();
        alert('adding widget!');
    };

    DashboardView.prototype.render = function() {
        this.$el.children().detach();
        this.$el.append(this.renderTemplate(DashboardTemplate));
    };

    return DashboardView;
});
