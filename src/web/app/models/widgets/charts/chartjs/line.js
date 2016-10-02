/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/widgets',
        'defaults': {
            'id': '',
            'name': '',
            'options': {
                'type': 'line',
                'data': {},
                'options': {}
            }
        }
    });

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
