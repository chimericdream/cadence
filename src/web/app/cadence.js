'use strict';

define(
    'cadence',
    [
        'jquery',
        'backbone',
        'notifyjs',
        'routers/home',
        'routers/plugins',
        'routers/shards',
        'util/hbs-helpers',
        'util/load-partials',
        'util/load-jq-plugins'
    ],
    (
        $,
        Backbone,
        notifyjs,
        HomeRouter,
        PluginRouter,
        ShardRouter
    ) => {
        const Cadence = Backbone.Router.extend();

        Cadence.prototype.initialize = function() {
            this._subRouters = {
                'home': new HomeRouter(),
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
