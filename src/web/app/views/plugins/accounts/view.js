'use strict';

define(
    'views/plugins/accounts/view',
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
        const View = BaseView.extend({});

        View.prototype.render = function(data) {
            const plugin = new PluginModel({'id': data.plugin});
            const account = new AccountModel({
                'id': data.account,
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

        return View;
    }
);
