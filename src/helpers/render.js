const _ = require('lodash');

const sidebarLinks = {
    'Configuration': {
        'links': [
            {'path': '/admin/bridges/', 'text': 'Bridges', 'icon': 'code'}
        ]
    },
    'Connections': {
        'links': [
            {'path': '/shards/', 'text': 'Shards', 'icon': 'database'},
            {'path': '/relationships/', 'text': 'Relationships', 'icon': 'exchange'},
            {'path': '/workflows/', 'text': 'Workflows', 'icon': 'sitemap'}
        ]
    }
};

module.exports = function(template, response, data = {}, callback = null) {
    _.merge(data, {
        'currentUrl': response.req.originalUrl,
        'sidebarLinks': sidebarLinks
    });
    response.render(template, data, callback);
};
