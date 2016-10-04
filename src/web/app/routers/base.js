/* global define */
'use strict';

define(['backbone'], function(Backbone) {
    const views = {};

    const BaseRouter = Backbone.Router.extend();

    BaseRouter.prototype.initialize = function() {
        this.$app = $('#cadence-app');
    };

    BaseRouter.prototype.isEventListenedTo = function(eventName) {
        return (this._events) ? !!this._events[eventName] : false;
    };

    BaseRouter.prototype.getView = function(viewId, done) {
        if (typeof views[viewId] !== 'undefined') {
            done(views[viewId]);
            return;
        }

        require([viewId], (View) => {
            views[viewId] = new View();
            done(views[viewId]);
        });
    };

    BaseRouter.prototype.render = function(view, data) {
        view.render(data);

        this.$app.children().detach();
        $('body').removeClass('js-cadence-pre-init');
        this.$app.append(view.$el);
    };

    return BaseRouter;
});
