'use strict';

define('routers/plugins', ['backbone'], (Backbone) => {
    const Router = Backbone.Router.extend({
        'routes': {
            'plugins': 'pluginList',
            'plugins/add-account/:plugin': 'addAccount'
        }
    });

    Router.prototype.pluginList = function() {
        require(['views/plugins/index'], (ListView) => {
            const view = new ListView();
            view.render()
                .then(() => {
                    $('#cadence-app').children().detach();
                    $('#cadence-app').append(view.$el);
                });
        });
    };

    Router.prototype.addAccount = function(plugin) {
        require(['views/plugins/add-account'], (AddAccountView) => {
            const view = new AddAccountView(plugin);
            view.render()
                .then(() => {
                    $('#cadence-app').children().detach();
                    $('#cadence-app').append(view.$el);
                });
        });
    };

    return Router;
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
