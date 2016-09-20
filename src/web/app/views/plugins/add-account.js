'use strict';

define(
    'views/plugins/add-account',
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
        const View = BaseView.extend({
            'events': {
                'click #save-account-btn': 'addAccount'
            }
        });

        View.prototype.addAccount = function(event) {
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
                $.notify(`Account <kbd>${ accountData.account }</kbd> added to ${ accountData.plugin }.`);
                this.trigger('account:added');
            });
        };

        View.prototype.render = function(data) {
            this.$el.children().detach();

            const plugin = new PluginModel({'id': data.plugin});

            return plugin
                .getAccountTemplate()
                .done((data) => {
                    this.$el.append(this.renderTemplate(AddEditAccountTemplate, {
                        'plugin': plugin.attributes,
                        'fields': data['account-template'].fields,
                        'account': {}
                    }));
                });
        };

        return View;
    }
);
