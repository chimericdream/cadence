'use strict';

define('views/plugins/add-account', ['backbone', 'views/base', 'collections/plugins', 'models/plugin', 'text!templates/plugins/plugin/index.hbs'], (Backbone, BaseView, PluginCollection, PluginModel, AddEditAccountTemplate) => {
    const View = BaseView.extend({});

    View.prototype.initialize = function(plugin) {
        this.plugin = new PluginModel({'id': plugin});
    };

    View.prototype.render = function() {
        this.$el.children().detach();

        return this.plugin
            .getAccountTemplate()
            .done((data, status, xhr) => {
                this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                    'plugin': this.plugin.attributes,
                    'fields': data['account-template'].fields,
                    'account': {}
                }));
            });
    };

    return View;
});
