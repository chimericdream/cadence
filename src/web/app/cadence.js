/* global define */
'use strict';

define(
    [
        'jquery',
        'backbone',
        'marionette',
        'backbone.radio',
        'views/site',
        'routers/dashboard',
        'routers/plugins',
        'routers/shards',
        'util/cadence-init'
    ],
    (
        $,
        Backbone,
        Marionette,
        Radio,
        SiteView,
        DashboardRouter,
        PluginRouter,
        ShardRouter
    ) => {
        const Cadence = Marionette.Application.extend({
            'region': '#cadence-app'
        });

        Cadence.prototype.initialize = function() {
            this.routers = {
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
                    Backbone.history.navigate(href, {'trigger': true});
                }
            });

            this.mainView = new SiteView();
        };

        Cadence.prototype.onStart = function() {
            Backbone.history.start();
            $('body').removeClass('js-cadence-pre-init');
            this.showView(this.mainView);
        };

        return Cadence;
    });
