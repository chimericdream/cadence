/* global define */
'use strict';

// TODO: I think this might be able to be generalized to a universal modal view. If nothing else, I can probably make a
// generic modal view that extends BaseView and which other modal views extend further.
define(
    [
        'jquery',
        'views/base',
        'models/plugin',
        'models/plugins/account',
        'text!templates/modal.hbs'
    ],
    (
        $,
        BaseView,
        PluginModel,
        AccountModel,
        ModalTemplate
    ) => {
        const View = BaseView.extend({
            'events': {
                'click .js-modal-action-button': 'confirmAction'
            }
        });

        View.prototype.confirmAction = function(event) {
            event.preventDefault();
            event.stopPropagation();

            this.$el.detach();
            $('body > .modal-backdrop').remove();

            this.trigger('confirm:action');
        };

        View.prototype.render = function(data) {
            const plugin = new PluginModel({'id': data.plugin.id, 'name': data.plugin.name});
            const account = new AccountModel({
                'id': data.account.id,
                'plugin': plugin
            });

            const timestamp = Date.now();

            this.$el.children().detach();
            this.$el.append(this.renderTemplate(ModalTemplate, {
                'id': `modal-${ timestamp }`,
                'label': `modal-label-${ timestamp }`,
                'title': 'Careful!',
                'body': `<p>This action cannot be undone. The account <code>${ account.get('id') }</code> will be removed from the ${ plugin.get('name') } plugin, along with all of its associated data.</p><p>Do you want to proceed?</p>`,
                'buttons': {
                    'action': {
                        'class': 'btn-danger',
                        'text': 'Delete Account'
                    },
                    'dismiss': {
                        'text': 'Cancel'
                    }
                }
            }));

            $('body').append(this.$el);
            $(`#modal-${ timestamp }`).modal();
            $(`#modal-${ timestamp }`).on('hidden.bs.modal', () => {
                this.trigger('cancel:modal')
                this.$el.detach();
            });
        };

        return View;
    }
);
