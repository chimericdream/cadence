'use strict';

define('routers/plugins', ['routers/base'], (BaseRouter) => {
    const Router = BaseRouter.extend({
        'routes': {
            'plugins': 'pluginList',
            'plugins/:plugin/add-account': 'addAccount',
            'plugins/:plugin/edit-account/:account': 'editAccount'
        }
    });

    Router.prototype.pluginList = function() {
        let account;
        if (typeof this._addedAccount !== 'undefined') {
            account = this._addedAccount;
            account.action = 'add';
            delete this._addedAccount;
        }
        this.getView('views/plugins/index', (ListView) => {
            this.render(ListView, {'modifiedAccount': account});
        });
    };

    Router.prototype.addAccount = function(plugin) {
        this.getView('views/plugins/add-account', (AddAccountView) => {
            if (!AddAccountView.isEventListenedTo('account:added')) {
                this.listenTo(AddAccountView, 'account:added', (data) => {
                    this._addedAccount = data;
                    this.navigate('/plugins', {'trigger': true});
                });
            }
            this.render(AddAccountView, {'plugin': plugin});
        });
    };

    Router.prototype.editAccount = function(plugin, account) {
        this.getView('views/plugins/edit-account', (EditAccountView) => {
            this.render(EditAccountView, {'plugin': plugin, 'account': account});
        });
    };

    return Router;
});
// $('#shard-type').on('change', (event) => {
//     const $el = $(event.target);
//     $('#shard-value-notype, #shard-value-boolean, #shard-value-json, #shard-value-text').addClass('hidden-xs-up');
//     switch ($el.val()) {
//         case 'boolean':
//             $('#shard-value-boolean').removeClass('hidden-xs-up');
//             break;
//         case 'json':
//             $('#shard-value-json').removeClass('hidden-xs-up');
//             break;
//         case 'text':
//             $('#shard-value-text').removeClass('hidden-xs-up');
//             break;
//         default:
//             $('#shard-value-notype').removeClass('hidden-xs-up');
//             break;
//     }
// });
