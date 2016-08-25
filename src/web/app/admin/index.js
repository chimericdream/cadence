'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const configuration = require('./configuration');

router.use('/configuration', configuration);

router.get('/', (request, response) => {
    response.send('admin home page');
});

module.exports = router;
