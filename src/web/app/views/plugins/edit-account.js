'use strict';

define(
    'views/plugins/edit-account',
    [
        'jquery',
        'backbone',
        'views/base',
        'collections/plugins',
        'models/plugin',
        'models/plugins/account',
        'text!templates/plugins/plugin/index.hbs'
    ],
    (
        $,
        Backbone,
        BaseView,
        PluginCollection,
        PluginModel,
        AccountModel,
        AddEditAccountTemplate
    ) => {
    const View = BaseView.extend({});

    View.prototype.initialize = function(plugin, account) {
        this.plugin = new PluginModel({'id': plugin});
        this.account = new AccountModel({
            'id': account,
            'plugin': this.plugin
        });
    };

    View.prototype.render = function() {
        let fields;
        const templatePlugin = this.plugin
            .getAccountTemplate()
            .done((data) => {
                fields = data['account-template'].fields
            });
        const accountPromise = this.account.fetch();

        this.$el.children().detach();

        return $.when(templatePlugin, accountPromise)
            .then(() => {
                this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                    'plugin': this.plugin.attributes,
                    'fields': fields,
                    'account': this.account.attributes
                }));
            });
    };

    return View;
});
