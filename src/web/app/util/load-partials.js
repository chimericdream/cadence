'use strict';

define(
    [
        'handlebars',
        'text!templates/partials/layout/footer.hbs',
        'text!templates/partials/layout/header.hbs',
        'text!templates/partials/shards/add-edit-form.hbs',
        'text!templates/partials/nav.hbs',
        'text!templates/partials/sidebar.hbs'
    ],
    (
        Handlebars,
        layoutFooter,
        layoutHeader,
        shardsAddeditform,
        nav,
        sidebar
    ) => {
        Handlebars.registerPartial('layout/footer', layoutFooter);
        Handlebars.registerPartial('layout/header', layoutHeader);
        Handlebars.registerPartial('shards/addEditForm', shardsAddeditform);
        Handlebars.registerPartial('nav', nav);
        Handlebars.registerPartial('sidebar', sidebar);
    }
);
