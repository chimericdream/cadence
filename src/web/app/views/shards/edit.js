/* global define */
'use strict';

define(
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
        const EditShardView = BaseView.extend({
            'events': {
                'click #save-shard-btn': 'saveShard'
            }
        });

        // TODO: make this use the ShardModel and its `save()` method
        EditShardView.prototype.saveShard = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const shard = new ShardModel({
                'id': $('#shard-id').val(),
                'description': $('#shard-description').val(),
                'type': $('#shard-type').val()
            });
            switch (shard.get('type')) {
                case 'boolean':
                    if ($('input[name=shard-value-boolean]:checked').val() === 'true') {
                        shard.set('value', true);
                    } else {
                        shard.set('value', false);
                    }
                    break;
                case 'json':
                    shard.set('value', JSON.parse($('#shard-value-json textarea').val()));
                    break;
                case 'text':
                    shard.set('value', $('#shard-value-text input').val());
                    break;
            }
            shard.save()
                .done(() => {
                    $.notify(`Shard <kbd>${ shard.get('id') }</kbd> updated.`);
                    this.trigger('shard:saved');
                });
        };

        EditShardView.prototype.render = function(data) {
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

        return EditShardView;
    }
);
