'use strict';

define('models/plugins/account', ['jquery', 'lodash', 'backbone'], ($, _, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/plugins',
        'defaults': {
            'id': '',
            'name': '',
            'plugin': null,
            'fields': {},
            'data': {}
        }
    });

    Model.prototype.url = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/accounts/${ this.get('id') }`;
    };

    return Model;
});
