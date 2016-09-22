'use strict';

define(
    'views/shards/edit',
    [
        'jquery',
        'views/base',
        'models/shard',
        'text!templates/shards/edit.hbs'
    ],
    (
        $,
        BaseView,
        ShardModel,
        EditShardTemplate
    ) => {
        const View = BaseView.extend({
            'events': {
                'click #save-shard-btn': 'saveShard'
            }
        });

        // TODO: make this use the ShardModel and its `save()` method
        View.prototype.saveShard = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const url = $('#shard-form').attr('action');
            $.ajax({
                'url': url,
                'method': 'POST',
                'processData': false,
                'dataType': 'text',
                'data': $('#shard-form').serialize()
            }).done((data, status, xhr) => {
                const shardId = xhr.getResponseHeader('X-Cadence-Shard-ID');
                $.notify(`Shard <kbd>${ shardId }</kbd> updated.`);
                this.trigger('shard:saved');
            });
        };

        View.prototype.render = function(data) {
            const shard = new ShardModel({'id': data.shard});

            this.$el.children().detach();

            return shard
                .fetch()
                .then(() => {
                    this.$el.append(this.renderTemplate(EditShardTemplate, {
                        'shard': shard.attributes
                    }));
                });
        };

        return View;
    }
);
