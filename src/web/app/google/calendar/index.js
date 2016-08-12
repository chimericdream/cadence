'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.send('Google Calendar home page');
});

module.exports = router;
