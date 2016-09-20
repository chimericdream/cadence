'use strict';

define(['jquery', 'notifyjs'], ($) => {
    $.notify.addStyle('twbs', {
        html: '<div><span data-notify-html></span></div>'
    });
    $.notify.defaults({'className': 'success', 'style': 'twbs'});
});
