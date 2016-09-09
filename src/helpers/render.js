const _ = require('lodash');

const sidebarLinks = {
    'Configuration': {
        'links': [
            {'path': '/admin/bridges/', 'text': 'Bridges'}
        ]
    },
    'Connections': {
        'links': [
            {'path': '/shards/', 'text': 'Shards'},
            {'path': '/relationships/', 'text': 'Relationships'},
            {'path': '/workflows/', 'text': 'Workflows'}
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
