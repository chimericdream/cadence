'use strict';

define('routers/base', ['backbone'], (Backbone) => {
    const Router = Backbone.Router.extend({
        'views': {}
    });

    Router.prototype.isEventListenedTo = function(eventName) {
        return (this._events) ? !!this._events[eventName] : false;
    };

    Router.prototype.getView = function(viewId, done) {
        if (typeof this.views[viewId] !== 'undefined') {
            done(this.views[viewId]);
            return;
        }

        require([viewId], (View) => {
            this.views[viewId] = new View();
            done(this.views[viewId]);
        });
    };

    Router.prototype.render = function(view, data) {
        view.render(data)
            .then(() => {
                $('#cadence-app').children().detach();
                $('#cadence-app').append(view.$el);
            });
    };

    return Router;
});
