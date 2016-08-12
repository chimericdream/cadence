'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.send('Toodledo home page');
});

module.exports = router;
