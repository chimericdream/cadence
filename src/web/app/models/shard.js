'use strict';

define('models/shard', ['jquery', 'backbone'], ($, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/shards',
        'defaults': {
            'id': '',
            'description': '',
            'type': '',
            'value': '',
            'updated': 0
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

    Model.prototype.save = function() {
        this.set('updated', Date.now());
        return Backbone.Model.prototype.save.call(this);
    };

    Model.prototype.create = function() {
        this.set('updated', Date.now());
        return $.ajax({
            'url': this.createUrl(),
            'method': 'POST',
            'contentType': 'application/json',
            'processData': false,
            'data': JSON.stringify(this.attributes)
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
