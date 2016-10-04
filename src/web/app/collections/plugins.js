/* global define */
'use strict';

define(['collections/base', 'models/plugin'], (BaseCollection, PluginModel) => {
    const Collection = BaseCollection.extend({
        'url': '/api/plugins/',
        'model': PluginModel
    });

    return Collection;
});
