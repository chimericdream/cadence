'use strict';

const express = require('express');
const fs = require('fs');
const toodledo = require('node-toodledo');

// eslint-disable-next-line new-cap
const router = express.Router();

const FIVE_MINUTES = 300000;

const apiInstances = {};
const accountInfo = {};

router.get('/data/:account/', (request, response) => {
    response.send('return all data stored in NCL for specific account.');
});

router.get('/authorize/:account/', (request, response) => {
    response.send('make the initial authorization request');
});

router.get('/account-info/:account/', (request, response) => {
    const accountSlug = request.params.account;
    const accounts = JSON.parse(fs.readFileSync('data/adapters/toodledo/account-info.json'));

    const adapterConfig = JSON.parse(fs.readFileSync('config/adapters/toodledo.json'));
    if (!adapterConfig.accounts.hasOwnProperty(accountSlug)) {
        throw new Error('account not found');
    }

    const accountConfig = adapterConfig.accounts[accountSlug];
    if (typeof apiInstances[accountSlug] === 'undefined') {
        apiInstances[accountSlug] = new toodledo.API(accountConfig.fields).loadTokens(accountConfig.data);

    }

    if (typeof accountInfo[accountSlug] === 'undefined') {
        accountInfo[accountSlug] = new toodledo.AccountInfo(apiInstances[accountSlug]);

        accountInfo[accountSlug]
            .on('error', (exception) => {
                if (exception.name === 'INVALID_ACCESS_TOKEN') {
                    apiInstances[accountSlug].refreshAccessToken();
                }
            })
            .on('account-info:loaded', () => {
                accounts[accountSlug] = accountInfo[accountSlug].data;
                accounts[accountSlug]['_retrieved'] = Date.now();
                fs.writeFileSync('data/adapters/toodledo/account-info.json', JSON.stringify(accounts, null, 4));
                response.send(JSON.stringify(accountInfo[accountSlug].data, null, 4));
            });
    }

    if (accounts[accountSlug] && (accounts[accountSlug]['_retrieved'] + FIVE_MINUTES) >= Date.now()) {
        response.send(JSON.stringify(accounts[accountSlug]));
    } else {
        accountInfo[accountSlug].fetch();
    }
});

module.exports = router;
