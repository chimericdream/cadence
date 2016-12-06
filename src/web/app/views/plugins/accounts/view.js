/* global define */
'use strict';

define(
    [
        'jquery',
        'views/base',
        'collections/plugins',
        'models/plugin',
        'models/plugins/account',
        'text!templates/plugins/accounts/view.hbs'
    ],
    (
        $,
        BaseView,
        PluginCollection,
        PluginModel,
        AccountModel,
        ViewAccountTemplate
    ) => {
        const PluginAccountView = BaseView.extend({});

        PluginAccountView.prototype.render = function() {
            const plugin = new PluginModel({'id': this.templateData.plugin});
            const account = new AccountModel({
                'id': this.templateData.account,
                'plugin': plugin
            });

            let fields;
            const accountTemplatePromise = plugin
                .getAccountTemplate()
                .done((response) => {
                    fields = response['account-template'].fields
                });

            const pluginPromise = plugin.fetch();
            const accountPromise = account.fetch();

            let accountData;
            const accountDataPromise = account
                .getData()
                .done((response) => {
                    accountData = response;
                });

            this.$el.children().detach();

            return $.when(accountTemplatePromise, pluginPromise, accountPromise, accountDataPromise)
                .then(() => {
                    this.$el.append(this.renderTemplate(ViewAccountTemplate, {
                        'plugin': plugin.attributes,
                        'fields': fields,
                        'account': account.attributes,
                        'accountData': accountData
                    }));
                });
        };

        return PluginAccountView;
    }
);
