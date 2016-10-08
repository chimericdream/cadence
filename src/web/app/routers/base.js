/* global define */
'use strict';

define(['marionette', 'backbone.radio'], function(Marionette, Radio) {
    const views = {};

    const BaseRouter = Marionette.AppRouter.extend();

    BaseRouter.prototype.getView = function(viewId, done) {
        if (typeof views[viewId] !== 'undefined') {
            done(views[viewId]);
            return;
        }

        require([viewId], (View) => {
            views[viewId] = View;
            done(views[viewId]);
        });
    };

    BaseRouter.prototype.renderView = function(viewId, data) {
        this.getView(viewId, (View) => {
            const context = data || {};
            const channel = Radio.channel('rendering');
            channel.trigger('render:view:request', {
                'view': View,
                'context': context
            });
        });
    };

    BaseRouter.prototype.onRoute = function(name, path, args) {
        const channel = Radio.channel('routing');
        channel.trigger('route:changed', {
            'name': name,
            'path': path,
            'args': args
        });
    };

    return BaseRouter;
});
