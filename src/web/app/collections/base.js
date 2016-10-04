/* global define */
'use strict';

define(['backbone'], (Backbone) => {
    const BaseCollection = Backbone.Collection.extend();

    BaseCollection.prototype.parse = function(response) {
        const models = [];

        Object.keys(response).forEach((key) => {
            const model = response[key];
            model.id = key;
            models.push(model);
        });

        return models;
    };

    return BaseCollection;
});
