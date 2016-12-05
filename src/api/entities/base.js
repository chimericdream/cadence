/* global define */
'use strict';

define([], () => {
    class BaseEntity {
        get events() {
            return [];
        }

        get actions() {
            return {};
        }
    }

    return BaseEntity;
});
