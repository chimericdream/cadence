'use strict';

define(
    'cadence',
    ['jquery', 'backbone', 'notifyjs', 'routers/plugins', 'util/hbs-helpers', 'util/load-partials', 'util/load-jq-plugins'],
    ($, Backbone, notifyjs, PluginRouter) => {
        const Cadence = Backbone.Router.extend({
            'routes': {
                '': 'home'
            }
        });

        Cadence.prototype.initialize = function() {
            this._subRouters = {
                'plugins': new PluginRouter()
            };

            $('body').on('click', 'a', (event) => {
                if (event.currentTarget.hasAttribute('data-toggle')) {
                    event.preventDefault();
                    return;
                }
                const href = $(event.currentTarget).attr('href');
                if (href.search(/^(?:\w+:)?\/\/.*$/) === -1) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.navigate(href, {'trigger': true});
                }
            });
        };

        Cadence.prototype.home = function() {
            require(['views/base'], (View) => {
                const page = new View();
                page.render();
            });
        };

        Cadence.prototype.start = function() {
            console.log('starting router');
            Backbone.history.start();
        };

        const app = new Cadence();

        $('body').removeClass('js-cadence-pre-init');
        app.start();
    });
    // $('.plugin-enable-button, .plugin-disable-button').on('click', (event) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //
    //     const $el = $(event.target);
    //     const $title = $el.parent().parent().find('.card-title');
    //
    //     $.ajax({
    //         'url': $el[0].href,
    //         'method': 'PUT',
    //         'success': () => {
    //             $title.find('span').toggle();
    //             $el.parent().find('.plugin-enable-button, .plugin-disable-button').toggle();
    //         }
    //     });
    // });
    //
    // $('#account-name').on('blur', () => {
    //     if ($('#account-slug').val() === '') {
    //         let safeSlug;
    //         safeSlug = $('#account-name')
    //             .val()
    //             .toLowerCase()
    //             .replace(/[^a-z0-9]/g, '-')
    //             .replace(/^(.+)-$/, '$1')
    //             .replace(/^-(.+)$/, '$1');
    //
    //         $('#account-slug').val(safeSlug);
    //     }
    // });
    //
    // $('#shard-type').on('change', (event) => {
    //     const $el = $(event.target);
    //     $('#shard-value-notype, #shard-value-boolean, #shard-value-json, #shard-value-text').addClass('hidden-xs-up');
    //     switch ($el.val()) {
    //         case 'boolean':
    //             $('#shard-value-boolean').removeClass('hidden-xs-up');
    //             break;
    //         case 'json':
    //             $('#shard-value-json').removeClass('hidden-xs-up');
    //             break;
    //         case 'text':
    //             $('#shard-value-text').removeClass('hidden-xs-up');
    //             break;
    //         default:
    //             $('#shard-value-notype').removeClass('hidden-xs-up');
    //             break;
    //     }
    // });
