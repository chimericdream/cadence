'use strict';

define(['jquery', 'bootstrap', 'notifyjs'], ($) => {
    $.notify.addStyle('twbs', {
        html: '<div><span data-notify-html></span></div>'
    });
    $.notify.defaults({'className': 'success', 'style': 'twbs'});
});
