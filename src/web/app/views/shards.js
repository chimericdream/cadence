/* global define */
'use strict';

define(
    [
        'jquery',
        'lodash',
        'marionette',
        'views/shards/list',
        'views/shards/delete-modal',
        'collections/shards',
        'models/shard',
        'text!templates/shards.hbs'
    ],
    (
        $,
        _,
        Marionette,
        ShardListView,
        DeleteModalView,
        ShardCollection,
        ShardModel,
        ShardPageTemplate
    ) => {
        const ShardPageView = Marionette.View.extend({
            'events': {
                'click .js-delete-shard': 'deleteShard'
            },
            'template': ShardPageTemplate,
            'regions': {
                'shard-list': '#shard-list'
            }
        });

        ShardPageView.prototype.initialize = function() {
            this.shards = new ShardCollection();
        };

        ShardPageView.prototype.deleteShard = function(event) {
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

        ShardPageView.prototype.onRender = function() {
            this.shards
                .fetch()
                .done((shards) => {
                    this.showChildView('shard-list', new ShardListView(shards));
                });
        };

        return ShardPageView;
    }
);
