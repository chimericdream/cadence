'use strict';

const express = require('express');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

const plugins = require('./plugins/index');

router.use('/plugins', plugins);

router.get('/', (request, response) => {
    response.send('admin home page');
});

module.exports = router;
