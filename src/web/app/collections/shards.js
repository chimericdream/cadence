/* global define */
'use strict';

define(['collections/base', 'models/shard'], (BaseCollection, ShardModel) => {
    const ShardCollection = BaseCollection.extend({
        'url': '/api/shards/',
        'model': ShardModel
    });

    return ShardCollection;
});
