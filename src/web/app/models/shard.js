/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const ShardModel = Backbone.Model.extend({
        'urlRoot': '/api/shards',
        'defaults': {
            'id': '',
            'description': '',
            'type': '',
            'value': '',
            'updated': 0
        }
    });

    ShardModel.prototype.url = function() {
        return `${ this.urlRoot }/${ this.get('id') }`;
    };

    ShardModel.prototype.historyUrl = function() {
        return `${ this.urlRoot }/history/${ this.get('id') }`;
    };

    ShardModel.prototype.save = function() {
        this.set('updated', Date.now());
        return Backbone.Model.prototype.save.call(this);
    };

    ShardModel.prototype.getHistory = function() {
        return $.ajax({
            'url': this.historyUrl(),
            'dataType': 'json'
        });
    };

    return ShardModel;
});
