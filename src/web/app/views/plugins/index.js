'use strict';

define('views/plugins/index', ['backbone', 'views/base', 'collections/plugins', 'text!templates/plugins/index.hbs'], (Backbone, BaseView, PluginCollection, PluginPageTemplate) => {
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

    View.prototype.render = function() {
        this.$el.children().detach();

        return this.plugins
            .fetch()
            .done((data, status, xhr) => {
                this.$el.append(this.renderTemplate(PluginPageTemplate, {
                    'plugins': data
                }));
            });
    };

    return View;
});
