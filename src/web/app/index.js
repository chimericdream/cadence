'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.render('index.hbs');
});

module.exports = router;
