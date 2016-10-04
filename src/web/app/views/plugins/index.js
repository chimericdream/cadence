/* global define */
'use strict';

define(
    ['jquery', 'lodash', 'views/base', 'views/plugins/accounts/delete-modal', 'collections/plugins', 'models/plugin', 'models/plugins/account', 'text!templates/plugins/index.hbs'],
    ($, _, BaseView, DeleteAccountModalView, PluginCollection, PluginModel, AccountModel, PluginPageTemplate) => {
        const PluginListView = BaseView.extend({
            'events': {
                'click .js-enable-plugin': 'enablePlugin',
                'click .js-disable-plugin': 'disablePlugin',
                'click .js-delete-account': 'deleteAccount'
            }
        });

        PluginListView.prototype.initialize = function() {
            this.plugins = new PluginCollection();
        };

        PluginListView.prototype.deleteAccount = function(event) {
            event.preventDefault();
            event.stopPropagation();

            const dataAttrs = event.currentTarget.dataset;
            const modal = new DeleteAccountModalView();
            const data = {
                'plugin': {
                    'id': dataAttrs['pluginKey'],
                    'name': dataAttrs['pluginName']
                },
                'account': {
                    'id': dataAttrs['accountKey']
                }
            };
            this.listenToOnce(modal, 'cancel:modal', () => {
                this.stopListening(modal);
            });
            this.listenToOnce(modal, 'confirm:action', () => {
                this.stopListening(modal);
                const plugin = new PluginModel({'id': dataAttrs['pluginKey']});
                const account = new AccountModel({'id': dataAttrs['accountKey'], 'plugin': plugin});
                account.destroy()
                    .done(() => {
                        $.notify(`Account <kbd>${ dataAttrs['accountKey'] }</kbd> removed from ${ dataAttrs['pluginName'] }.`);
                        this.render();
                    });
            });
            modal.render(data);
        };

        PluginListView.prototype.enablePlugin = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const id = event.currentTarget.dataset.plugin;
            const plugin = this.plugins.get(id);
            plugin.enable()
                .then(() => {
                    $.notify(`${ plugin.get('id') } plugin enabled.`);
                    this.render();
                });
        };

        PluginListView.prototype.disablePlugin = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const id = event.currentTarget.dataset.plugin;
            const plugin = this.plugins.get(id);
            plugin.disable()
                .then(() => {
                    $.notify(`${ plugin.get('id') } plugin disabled.`);
                    this.render();
                });
        };

        PluginListView.prototype.render = function(data) {
            this.$el.children().detach();

            return this.plugins
                .fetch()
                .done((plugins) => {
                    this.$el.append(
                        this.renderTemplate(
                            PluginPageTemplate,
                            _.merge(data, {'plugins': plugins})
                        )
                    );
                });
        };

        return PluginListView;
    }
);
