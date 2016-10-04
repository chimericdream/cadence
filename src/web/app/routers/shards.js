/* global define */
'use strict';

define(['routers/base'], (BaseRouter) => {
    const ShardRouter = BaseRouter.extend({
        'routes': {
            'shards': 'shardList',
            'shards/add': 'addShard',
            'shards/history/:shard': 'shardHistory',
            'shards/edit/:shard': 'editShard'
        }
    });

    ShardRouter.prototype.shardList = function() {
        this.getView('views/shards/index', (ListView) => {
            this.render(ListView);
        });
    };

    ShardRouter.prototype.addShard = function() {
        this.getView('views/shards/add', (AddShardView) => {
            if (!AddShardView.isEventListenedTo('shard:saved')) {
                this.listenTo(AddShardView, 'shard:saved', () => {
                    this.navigate('/shards', {'trigger': true});
                });
            }
            this.render(AddShardView);
        });
    };

    ShardRouter.prototype.editShard = function(shard) {
        this.getView('views/shards/edit', (EditShardView) => {
            if (!EditShardView.isEventListenedTo('shard:saved')) {
                this.listenTo(EditShardView, 'shard:saved', () => {
                    this.navigate('/shards', {'trigger': true});
                });
            }
            this.render(EditShardView, {'shard': shard});
        });
    };

    ShardRouter.prototype.shardHistory = function(shard) {
        this.getView('views/shards/history', (ShardHistoryView) => {
            this.render(ShardHistoryView, {'shard': shard});
        });
    };

    return ShardRouter;
});
