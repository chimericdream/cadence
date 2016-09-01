'use strict';

const express = require('express');
const toodledo = require('node-toodledo');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/data/:account/', (request, response) => {
    response.send('return all data stored in NCL for specific account.');
});

router.get('/authorize/:account/', (request, response) => {
    response.send('make the initial authorization request');
});

router.get('/account-info/:account/', (request, response) => {
    const accountSlug = request.params.account;
    console.log(accountSlug);
    response.end();
    // const api = new toodledo.API(credentials).loadTokens(tokens);
    // response.send('get/show account info for specific account.');
});

module.exports = router;
