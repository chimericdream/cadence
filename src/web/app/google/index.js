'use strict';

const express = require('express');
const router = express.Router();

const calendar = require('./calendar/index');

router.use('/calendar', calendar);

router.get('/', (request, response) => {
    response.send('Google home page');
});

module.exports = router;
