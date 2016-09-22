'use strict';

define('routers/base', ['backbone'], function(Backbone) {
    const views = {};

    const Router = Backbone.Router.extend();

    Router.prototype.isEventListenedTo = function(eventName) {
        return (this._events) ? !!this._events[eventName] : false;
    };

    Router.prototype.getView = function(viewId, done) {
        if (typeof views[viewId] !== 'undefined') {
            done(views[viewId]);
            return;
        }

        require([viewId], (View) => {
            views[viewId] = new View();
            done(views[viewId]);
        });
    };

    Router.prototype.render = function(view, data) {
        view.render(data);
        $('#cadence-app').children().detach();
        $('#cadence-app').append(view.$el);
    };

    return Router;
});
