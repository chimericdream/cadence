/* global define */
'use strict';

define(
    [
        'jquery',
        'views/base',
        'collections/plugins',
        'models/plugin',
        'models/plugins/account',
        'text!templates/plugins/accounts/add-edit.hbs'
    ],
    (
        $,
        BaseView,
        PluginCollection,
        PluginModel,
        AccountModel,
        AddEditAccountTemplate
    ) => {
        const EditPluginAccountView = BaseView.extend({
            'events': {
                'click #save-account-btn': 'saveAccount'
            }
        });

        // TODO: make this use the AccountModel and its `save()` method
        EditPluginAccountView.prototype.saveAccount = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const url = $('#plugin-account-form').attr('action');
            $.ajax({
                'url': url,
                'method': 'POST',
                'processData': false,
                'dataType': 'text',
                'data': $('#plugin-account-form').serialize()
            }).done((data, status, xhr) => {
                const accountData = {
                    'account': xhr.getResponseHeader('X-Cadence-Account-ID'),
                    'plugin': xhr.getResponseHeader('X-Cadence-Plugin')
                };
                $.notify(`Account <kbd>${ accountData.account }</kbd> in ${ accountData.plugin } updated.`);
                this.trigger('account:saved');
            });
        };

        EditPluginAccountView.prototype.render = function() {
            let fields;

            const plugin = new PluginModel({'id': this.templateData.plugin});
            const account = new AccountModel({
                'id': this.templateData.account,
                'plugin': plugin
            });

            const accountTemplatePromise = plugin
                .getAccountTemplate()
                .done((response) => {
                    fields = response['account-template'].fields
                });
            const accountPromise = account.fetch();

            this.$el.children().detach();

            return $.when(accountTemplatePromise, accountPromise)
                .then(() => {
                    this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                        'plugin': plugin.attributes,
                        'fields': fields,
                        'account': account.attributes
                    }));
                });
        };

        return EditPluginAccountView;
    }
);
