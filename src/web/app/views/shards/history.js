/* global define */
'use strict';

define(
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
        const ShardHistoryView = BaseView.extend({});

        ShardHistoryView.prototype.render = function() {
            const shard = new ShardModel({'id': this.templateData.shard});

            this.$el.children().detach();

            let history;
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

        return ShardHistoryView;
    }
);
