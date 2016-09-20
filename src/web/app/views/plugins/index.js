'use strict';

define(
    'views/plugins/index',
    [
        'lodash',
        'backbone',
        'views/base',
        'collections/plugins',
        'text!templates/plugins/index.hbs'
    ],
    (
        _,
        Backbone,
        BaseView,
        PluginCollection,
        PluginPageTemplate
    ) => {
        const View = BaseView.extend({
            'events': {
                'click .js-enable-plugin': 'enablePlugin',
                'click .js-disable-plugin': 'disablePlugin'
            }
        });

        View.prototype.initialize = function() {
            this.plugins = new PluginCollection();
        };

        View.prototype.enablePlugin = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const id = event.target.dataset.plugin;
            const plugin = this.plugins.get(id);
            plugin.enable()
                .then(() => {
                    this.render();
                });
        };

        View.prototype.disablePlugin = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const id = event.target.dataset.plugin;
            const plugin = this.plugins.get(id);
            plugin.disable()
                .then(() => {
                    this.render();
                });
        };

        View.prototype.render = function(data) {
            this.$el.children().detach();

            return this.plugins
                .fetch()
                .done((plugins) => {
                    this.$el.append(
                        this.renderTemplate(
                            PluginPageTemplate,
                            _.merge(data, {'plugins': plugins})
                        )
                    );
                });
        };

        return View;
    }
);
