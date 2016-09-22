'use strict';

define(
    'views/shards/add',
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
        const View = BaseView.extend({
            'events': {
                'click #save-shard-btn': 'saveShard',
                'change #shard-type': 'updateShardType'
            }
        });

        View.prototype.updateShardType = function(event) {
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
                $.notify(`Shard <kbd>${ shardId }</kbd> created.`);
                this.trigger('shard:saved');
            });
        };

        View.prototype.render = function() {
            this.$el.children().detach();
            this.$el.append(this.renderTemplate(AddShardTemplate));
        };

        return View;
    }
);
