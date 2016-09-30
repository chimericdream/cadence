'use strict';

const _ = require('lodash');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const calendar = require('./calendar/index');

router.use('/calendar', calendar.router);

router.get('/', (request, response) => {
    response.send('Google home page');
});

module.exports = {
    'router': router,
    'dataFiles': _.concat([
            'config/plugins/google.json'
        ],
        calendar.dataFiles
    ),
    'dataDirs': []
};
