'use strict';

define('views/plugins/add-account', ['backbone', 'views/base', 'collections/plugins', 'models/plugin', 'text!templates/plugins/plugin/index.hbs'], (Backbone, BaseView, PluginCollection, PluginModel, AddAccountTemplate) => {
    const View = BaseView.extend({});

    View.prototype.initialize = function(plugin) {
        this.plugin = new PluginModel({'id': plugin});
    };

    View.prototype.render = function() {
        // return this.plugins
        //     .fetch()
        //     .done((data, status, xhr) => {
        //         this.$el.children().detach();
        //         this.$el.append(this.renderTemplate(AddAccountTemplate, {
        //             'plugins': data
        //         }));
        //     });
    };

    return View;
});
