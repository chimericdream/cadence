'use strict';

const express = require('express');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    response.send('Toodledo home page');
});

module.exports = router;
