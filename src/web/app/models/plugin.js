'use strict';

define('models/plugin', ['jquery', 'lodash', 'backbone'], ($, _, Backbone) => {
    const Model = Backbone.Model.extend({
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

    Model.prototype.getAccountTemplate = function() {
        return $.ajax(`${ this.url() }/account-template`);
    };

    Model.prototype.enable = function() {
        const url = `${ this.url() }/enable`;
        return $.ajax({
            'url': url,
            'method': 'PUT',
            'success': () => {
                this.set('enabled', true);
            }
        });
    };

    Model.prototype.disable = function() {
        const url = `${ this.url() }/disable`;
        return $.ajax({
            'url': url,
            'method': 'PUT',
            'success': () => {
                this.set('enabled', false);
            }
        });
    };

    return Model;
});
