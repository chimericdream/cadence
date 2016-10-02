/* global define */
'use strict';

define(['jquery', 'notifyjs'], ($) => {
    'use strict';

    $.notify.addStyle('twbs', {
        html: '<div><span data-notify-html></span></div>'
    });
    $.notify.defaults({'className': 'success', 'style': 'twbs'});
});
