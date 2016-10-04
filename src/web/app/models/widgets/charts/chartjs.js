/* global define */
'use strict';

define(['jquery', 'backbone'], ($, Backbone) => {
    const ChartjsWidgetModel = Backbone.Model.extend({
        'urlRoot': '/api/widgets',
        'defaults': {
            'id': '',
            'name': '',
            'type': ''
        }
    });

    return ChartjsWidgetModel;
});
