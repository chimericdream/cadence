'use strict';

const express = require('express');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

const configuration = require('./configuration/index');

router.use('/configuration', configuration);

router.get('/', (request, response) => {
    response.send('admin home page');
});

module.exports = router;
