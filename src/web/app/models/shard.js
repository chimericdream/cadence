'use strict';

define('models/shard', ['jquery', 'backbone'], ($, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/shards',
        'defaults': {
            'id': '',
            'plugin': null,
            'fields': {},
            'data': {}
        }
    });

    Model.prototype.url = function() {
        return `${ this.urlRoot }/${ this.get('id') }`;
    };

    Model.prototype.createUrl = function() {
        return `${ this.urlRoot }/add`;
    };

    Model.prototype.historyUrl = function() {
        return `${ this.urlRoot }/history/${ this.get('id') }`;
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

    Model.prototype.getHistory = function() {
        return $.ajax({
            'url': this.historyUrl(),
            'dataType': 'json'
        });
    };

    return Model;
});
