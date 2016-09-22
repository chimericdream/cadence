'use strict';

define(
    'views/shards/history',
    [
        'jquery',
        'views/base',
        'models/shard',
        'text!templates/shards/history.hbs'
    ],
    (
        $,
        BaseView,
        ShardModel,
        ShardHistoryTemplate
    ) => {
        const View = BaseView.extend({});

        View.prototype.render = function(data) {
            const shard = new ShardModel({'id': data.shard});

            this.$el.children().detach();

            let history
            const shardPromise = shard.fetch();
            const historyPromise = shard.getHistory()
                .done((response) => {
                    history = response;
                });

            return $.when(shardPromise, historyPromise)
                .then(() => {
                    this.$el.append(this.renderTemplate(ShardHistoryTemplate, {
                        'shard': shard.attributes,
                        'history': history
                    }));
                });
        };

        return View;
    }
);
