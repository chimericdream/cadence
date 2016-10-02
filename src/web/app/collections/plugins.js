/* global define */
'use strict';

define(['backbone', 'models/plugin'], (Backbone, PluginModel) => {
    const Collection = Backbone.Collection.extend({
        'url': '/api/plugins/',
        'model': PluginModel
    });

    Collection.prototype.parse = function(response) {
        const models = [];

        Object.keys(response).forEach((key) => {
            const model = response[key];
            model.id = key;
            models.push(model);
        });

        return models;
    };

    return Collection;
});
