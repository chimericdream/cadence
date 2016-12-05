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
        const AddPluginAccountView = BaseView.extend({
            'events': {
                'click #save-account-btn': 'saveAccount'
            }
        });

        // TODO: make this use the AccountModel and its `create()` method
        AddPluginAccountView.prototype.saveAccount = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const $form = $('#plugin-account-form');
            const url = $form.attr('action');
            $.ajax({
                'url': url,
                'method': 'POST',
                'processData': false,
                'dataType': 'text',
                'data': $form.serialize()
            }).done((data, status, xhr) => {
                const accountData = {
                    'account': xhr.getResponseHeader('X-Cadence-Account-ID'),
                    'plugin': xhr.getResponseHeader('X-Cadence-Plugin')
                };
                $.notify(`Account <kbd>${ accountData.account }</kbd> added to ${ accountData.plugin }.`);
                this.trigger('account:saved');
            });
        };

        AddPluginAccountView.prototype.render = function(data) {
            this.$el.children().detach();

            const plugin = new PluginModel({'id': data.plugin});

            return plugin
                .getAccountTemplate()
                .done((response) => {
                    this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                        'plugin': plugin.attributes,
                        'fields': response['account-template'].fields,
                        'account': {}
                    }));
                });
        };

        return AddPluginAccountView;
    }
);
