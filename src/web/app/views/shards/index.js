/* global define */
'use strict';

define(
    [
        'jquery',
        'lodash',
        'views/base',
        'views/shards/delete-modal',
        'collections/shards',
        'models/shard',
        'text!templates/shards/index.hbs'
    ],
    (
        $,
        _,
        BaseView,
        DeleteModalView,
        ShardCollection,
        ShardModel,
        ShardPageTemplate
    ) => {
        const ShardListView = BaseView.extend({
            'events': {
                'click .js-delete-shard': 'deleteShard'
            }
        });

        ShardListView.prototype.initialize = function() {
            this.shards = new ShardCollection();
        };

        ShardListView.prototype.deleteShard = function(event) {
            event.preventDefault();
            event.stopPropagation();

            const dataAttrs = event.currentTarget.dataset;
            const modal = new DeleteModalView();
            const data = {
                'shard': {
                    'id': dataAttrs.shard
                }
            };
            this.listenToOnce(modal, 'cancel:modal', () => {
                this.stopListening(modal);
            });
            this.listenToOnce(modal, 'confirm:action', () => {
                this.stopListening(modal);
                const shard = new ShardModel({'id': dataAttrs.shard});
                shard.destroy()
                    .done(() => {
                        $.notify(`Shard <kbd>${ dataAttrs.shard }</kbd> has been deleted.`);
                        this.render();
                    });
            });
            modal.render(data);
        };

        ShardListView.prototype.render = function(data) {
            this.$el.children().detach();

            return this.shards
                .fetch()
                .done((shards) => {
                    this.$el.append(
                        this.renderTemplate(
                            ShardPageTemplate,
                            _.merge(data, {'shards': shards})
                        )
                    );
                });
        };

        return ShardListView;
    }
);
