/* global define */
'use strict';

define(
    [
        'jquery',
        'views/base',
        'text!templates/shards/list.hbs'
    ],
    (
        $,
        BaseView,
        ShardListTemplate
    ) => {
        const ShardListView = BaseView.extend({
            'template': ShardListTemplate
        });

        ShardListView.prototype.initialize = function(shards) {
            this.templateContext = {
                'shards': shards
            };
        };

        return ShardListView;
    }
);
