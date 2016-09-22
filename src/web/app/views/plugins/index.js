'use strict';

define(
    'views/plugins/index',
    ['jquery', 'lodash', 'views/base', 'views/plugins/accounts/delete-modal', 'collections/plugins', 'models/plugin', 'models/plugins/account', 'text!templates/plugins/index.hbs'],
    ($, _, BaseView, DeleteAccountModalView, PluginCollection, PluginModel, AccountModel, PluginPageTemplate) => {
        const View = BaseView.extend({
            'events': {
                'click .js-enable-plugin': 'enablePlugin',
                'click .js-disable-plugin': 'disablePlugin',
                'click .js-delete-account': 'deleteAccount'
            }
        });

        View.prototype.initialize = function() {
            this.plugins = new PluginCollection();
        };

        View.prototype.deleteAccount = function(event) {
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

        View.prototype.enablePlugin = function(event) {
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

        View.prototype.disablePlugin = function(event) {
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

        View.prototype.render = function(data) {
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

        return View;
    }
);
