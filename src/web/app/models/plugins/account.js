'use strict';

define('models/plugins/account', ['jquery', 'lodash', 'backbone'], ($, _, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/plugins',
        'defaults': {
            'id': '',
            'plugin': null,
            'fields': {},
            'data': {}
        }
    });

    Model.prototype.url = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/accounts/${ this.get('id') }`;
    };

    Model.prototype.createUrl = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/add-account`;
    };

    Model.prototype.dataUrl = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/data/${ this.get('id') }`;
    };

    Model.prototype.create = function() {
        return $.ajax({
            'url': this.createUrl(),
            'method': 'POST',
            'processData': false,
            'dataType': 'json',
            'data': this.attributes
        });
    };

    Model.prototype.getData = function() {
        return $.ajax({
            'url': this.dataUrl(),
            'dataType': 'json'
        });
    };

    return Model;
});
