'use strict';

module.exports = (data) => {
    if (data === '' || data === null || (typeof data.toString === 'function' && data.toString() === '')) {
        data = '{}';
    }
    return JSON.parse(data);
};
