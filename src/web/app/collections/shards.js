/* global define */
'use strict';

define(['collections/base', 'models/shard'], (BaseCollection, ShardModel) => {
    const Collection = BaseCollection.extend({
        'url': '/api/shards/',
        'model': ShardModel
    });

    return Collection;
});
