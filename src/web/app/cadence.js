/* global define */
'use strict';

define(
    [
        'jquery',
        'backbone',
        'notifyjs',
        'routers/dashboard',
        'routers/plugins',
        'routers/shards',
        'util/cadence-init'
    ],
    (
        $,
        Backbone,
        notifyjs,
        DashboardRouter,
        PluginRouter,
        ShardRouter
    ) => {
        const Cadence = Backbone.Router.extend();

        Cadence.prototype.initialize = function() {
            this._subRouters = {
                'dashboard': new DashboardRouter(),
                'plugins': new PluginRouter(),
                'shards': new ShardRouter()
            };

            $('body').on('click', 'a', (event) => {
                if (event.currentTarget.hasAttribute('data-toggle')) {
                    event.preventDefault();
                    return;
                }
                const href = $(event.currentTarget).attr('href');
                if (href.search(/^(?:\w+:)?\/\/.*$/) === -1) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.navigate(href, {'trigger': true});
                }
            });
        };

        Cadence.prototype.start = function() {
            Backbone.history.start();
        };

        const app = new Cadence();

        app.start();
    });
