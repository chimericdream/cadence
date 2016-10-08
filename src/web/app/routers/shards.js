/* global define */
'use strict';

define(['backbone.radio', 'routers/base'], (Radio, BaseRouter) => {
    const ShardRouter = BaseRouter.extend({
        'routes': {
            'shards': 'shardList',
            'shards/add': 'addShard',
            'shards/history/:shard': 'shardHistory',
            'shards/edit/:shard': 'editShard'
        }
    });

    ShardRouter.prototype.initialize = function() {
        const channel = Radio.channel('shards');
        const self = this;
        channel.on('shard:saved', () => {
            self.navigate('shards', {'trigger': true});
        });
    };

    ShardRouter.prototype.shardList = function() {
        this.renderView('views/shards');
    };

    ShardRouter.prototype.addShard = function() {
        this.renderView('views/shards/add');
    };

    ShardRouter.prototype.editShard = function(shard) {
        this.renderView('views/shards/edit', {'shard': shard});
    };

    ShardRouter.prototype.shardHistory = function(shard) {
        this.renderView('views/shards/history', {'shard': shard});
    };

    return ShardRouter;
});
