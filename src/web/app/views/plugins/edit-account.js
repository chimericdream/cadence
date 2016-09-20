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

        View.prototype.render = function(data) {
            let fields;

            const plugin = new PluginModel({'id': data.plugin});
            const account = new AccountModel({
                'id': data.account,
                'plugin': plugin
            });

            const templatePlugin = plugin
                .getAccountTemplate()
                .done((data) => {
                    fields = data['account-template'].fields
                });
            const accountPromise = account.fetch();

            this.$el.children().detach();

            return $.when(templatePlugin, accountPromise)
                .then(() => {
                    this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                        'plugin': plugin.attributes,
                        'fields': fields,
                        'account': account.attributes
                    }));
                });
        };

        return View;
    }
);
