'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    response.send('Google Calendar home page');
});

module.exports = {
    'router': router,
    'dataFiles': [
        'config/plugins/google/calendar.json'
    ]
};
