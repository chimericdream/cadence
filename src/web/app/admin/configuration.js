'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    response.render('admin/configuration.hbs');
});

module.exports = router;
