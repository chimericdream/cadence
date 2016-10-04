/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const PluginAccountModel = Backbone.Model.extend({
        'urlRoot': '/api/plugins',
        'defaults': {
            'id': '',
            'plugin': null,
            'fields': {},
            'data': {}
        }
    });

    PluginAccountModel.prototype.url = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/accounts/${ this.get('id') }`;
    };

    PluginAccountModel.prototype.createUrl = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/add-account`;
    };

    PluginAccountModel.prototype.dataUrl = function() {
        return `${ this.urlRoot }/${ this.get('plugin').get('id') }/data/${ this.get('id') }`;
    };

    PluginAccountModel.prototype.create = function() {
        return $.ajax({
            'url': this.createUrl(),
            'method': 'POST',
            'processData': false,
            'dataType': 'json',
            'data': this.attributes
        });
    };

    PluginAccountModel.prototype.getData = function() {
        return $.ajax({
            'url': this.dataUrl(),
            'dataType': 'json'
        });
    };

    return PluginAccountModel;
});
