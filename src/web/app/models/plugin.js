/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const PluginModel = Backbone.Model.extend({
        'urlRoot': '/api/plugins',
        'defaults': {
            'id': '',
            'name': '',
            'description': '',
            'config-file': '',
            'enabled': false,
            'components': {},
            'accounts': {}
        }
    });

    PluginModel.prototype.getAccountTemplate = function() {
        return $.ajax(`${ this.url() }/account-template`);
    };

    PluginModel.prototype.enable = function() {
        const url = `${ this.url() }/enable`;
        return $.ajax({
            'url': url,
            'method': 'PUT',
            'success': () => {
                this.set('enabled', true);
            }
        });
    };

    PluginModel.prototype.disable = function() {
        const url = `${ this.url() }/disable`;
        return $.ajax({
            'url': url,
            'method': 'PUT',
            'success': () => {
                this.set('enabled', false);
            }
        });
    };

    return PluginModel;
});
