/* global define */
'use strict';

define(['entities/base'], (BaseEntity) => {
    class ShardEntity extends BaseEntity {
        get events() {
            return [
                'shard:updated',
                'shard:deleted'
            ];
        }

        get actions() {
            return {
                'updateValue': 'updateValue',
                'updatePropertyValue': 'updatePropertyValue',
                'delete': 'destroy'
            };
        }
    }

    return ShardEntity;
});
