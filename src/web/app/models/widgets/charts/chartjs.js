/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const Model = Backbone.Model.extend({
        'urlRoot': '/api/widgets',
        'defaults': {
            'id': '',
            'name': '',
            'type': ''
        }
    });

    return Model;
});
