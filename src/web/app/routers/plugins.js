/* global define */
'use strict';

define(['backbone.radio', 'routers/base'], (Radio, BaseRouter) => {
    const PluginRouter = BaseRouter.extend({
        'routes': {
            'plugins': 'pluginList',
            'plugins/:plugin/accounts/add': 'addAccount',
            'plugins/:plugin/accounts/view/:account': 'viewAccount',
            'plugins/:plugin/accounts/edit/:account': 'editAccount'
        }
    });

    PluginRouter.prototype.initialize = function() {
        const channel = Radio.channel('plugins');
        const self = this;
        channel.on('account:saved', () => {
            self.navigate('plugins', {'trigger': true});
        });
    };

    PluginRouter.prototype.pluginList = function() {
        this.renderView('views/plugins');
    };

    PluginRouter.prototype.addAccount = function(plugin) {
        this.renderView('views/plugins/accounts/add', {'plugin': plugin});
    };

    PluginRouter.prototype.editAccount = function(plugin, account) {
        this.renderView('views/plugins/accounts/edit', {'plugin': plugin, 'account': account});
    };

    PluginRouter.prototype.viewAccount = function(plugin, account) {
        this.renderView('views/plugins/accounts/view', {'plugin': plugin, 'account': account});
    };

    return PluginRouter;
});
