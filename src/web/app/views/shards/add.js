/* global define */
'use strict';

define(
    [
        'jquery',
        'views/base',
        'models/shard',
        'text!templates/shards/add.hbs'
    ],
    (
        $,
        BaseView,
        ShardModel,
        AddShardTemplate
    ) => {
        const AddShardView = BaseView.extend({
            'events': {
                'click #save-shard-btn': 'saveShard',
                'change #shard-type': 'updateShardType'
            }
        });

        AddShardView.prototype.updateShardType = function(event) {
            const $el = $(event.target);
            $('#shard-value-notype, #shard-value-boolean, #shard-value-json, #shard-value-text').addClass('hidden-xs-up');
            switch ($el.val()) {
                case 'boolean':
                    $('#shard-value-boolean').removeClass('hidden-xs-up');
                    break;
                case 'json':
                    $('#shard-value-json').removeClass('hidden-xs-up');
                    break;
                case 'text':
                    $('#shard-value-text').removeClass('hidden-xs-up');
                    break;
                default:
                    $('#shard-value-notype').removeClass('hidden-xs-up');
                    break;
            }
        };

        // // TODO: make this use the ShardModel and its `create()` method
        AddShardView.prototype.saveShard = function(event) {
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
                    $.notify(`Shard <kbd>${ shard.get('id') }</kbd> created.`);
                    this.trigger('shard:saved');
                });
        };

        AddShardView.prototype.render = function() {
            this.$el.children().detach();
            this.$el.append(this.renderTemplate(AddShardTemplate));
        };

        return AddShardView;
    }
);
