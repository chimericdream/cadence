const _ = require('lodash');

module.exports = function(template, response, data = {}, callback = null) {
    _.merge(data, {});
    response.render(template, data, callback);
};
