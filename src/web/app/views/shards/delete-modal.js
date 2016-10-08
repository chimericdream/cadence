/* global define */
'use strict';

// TODO: I think this might be able to be generalized to a universal modal view. If nothing else, I can probably make a
// generic modal view that extends BaseView and which other modal views extend further.
define(
    [
        'jquery',
        'views/base',
        'models/shard',
        'text!templates/modal.hbs'
    ],
    (
        $,
        BaseView,
        ShardModel,
        ModalTemplate
    ) => {
        const DeleteShardModalView = BaseView.extend({
            'events': {
                'click .js-modal-action-button': 'confirmAction'
            }
        });

        DeleteShardModalView.prototype.confirmAction = function(event) {
            event.preventDefault();
            event.stopPropagation();

            this.$el.detach();
            $('body > .modal-backdrop').remove();

            this.trigger('confirm:action');
        };

        DeleteShardModalView.prototype.render = function(data) {
            const shard = new ShardModel({'id': data.shard.id});

            const timestamp = Date.now();

            this.$el.children().detach();
            this.$el.append(this.renderTemplate(ModalTemplate, {
                'id': `modal-${ timestamp }`,
                'label': `modal-label-${ timestamp }`,
                'title': 'Careful!',
                'body': `<p>This action cannot be undone. The shard <code>${ shard.get('id') }</code> will be deleted, potentially breaking any workflows or graphs using it.</p><p>Do you want to proceed?</p>`,
                'buttons': {
                    'action': {
                        'class': 'btn-danger',
                        'text': 'Delete Shard'
                    },
                    'dismiss': {
                        'text': 'Cancel'
                    }
                }
            }));

            $('body').append(this.$el);
            const $el = $(`#modal-${ timestamp }`);
            $el.modal();
            $el.on('hidden.bs.modal', () => {
                this.trigger('cancel:modal');
                this.$el.detach();
            });
        };

        return DeleteShardModalView;
    }
);
