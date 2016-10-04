/* global define */
'use strict';

define(['collections/base', 'models/plugin'], (BaseCollection, PluginModel) => {
    const PluginCollection = BaseCollection.extend({
        'url': '/api/plugins/',
        'model': PluginModel
    });

    return PluginCollection;
});
