/* global define */
'use strict';

define(['views/base', 'text!templates/index.hbs'], (BaseView, DashboardTemplate) => {
    const View = BaseView.extend({
        'events': {
            'click #db-add-widget': 'addWidget'
        }
    });

    View.prototype.addWidget = function(event) {
        event.preventDefault();
        event.stopPropagation();
        alert('adding widget!');
    };

    View.prototype.render = function() {
        this.$el.children().detach();
        this.$el.append(this.renderTemplate(DashboardTemplate));
    };

    return View;
});
