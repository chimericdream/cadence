'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    response.render('index.hbs');
});

module.exports = router;
