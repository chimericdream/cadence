'use strict';

const express = require('express');
const fs = require('fs');
const toodledo = require('node-toodledo');

// eslint-disable-next-line new-cap
const router = express.Router();

const FIVE_MINUTES = 300000;

const apiInstances = {};
const accountInfo = {};

function getApiInstance(key, config) {
    if (typeof apiInstances[key] === 'undefined') {
        apiInstances[key] = new toodledo.API(config.fields).loadTokens(config.data);
        apiInstances[key].on('tokens:loaded', (tokens) => {
            const adapterConfig = JSON.parse(fs.readFileSync('config/adapters/toodledo.json'));
            adapterConfig.accounts[key].data = tokens;
            fs.writeFileSync('config/adapters/toodledo.json', JSON.stringify(adapterConfig, null, 4));
        });
    }
    return apiInstances[key];
}

router.get('/data/:account/', (request, response) => {
    const accountSlug = request.params.account;
    const accounts = JSON.parse(fs.readFileSync('data/adapters/toodledo/account-info.json'));
    response.send(JSON.stringify({
        'account-info': accounts[accountSlug] || {}
    }));
});

router.get('/authorize/:account/', (request, response) => {
    response.send('make the initial authorization request');
});

router.get('/account-info/:account/', (request, response) => {
    const accountKey = request.params.account;
    const accounts = JSON.parse(fs.readFileSync('data/adapters/toodledo/account-info.json'));

    const adapterConfig = JSON.parse(fs.readFileSync('config/adapters/toodledo.json'));
    if (!adapterConfig.accounts.hasOwnProperty(accountKey)) {
        throw new Error('account not found');
    }

    const accountConfig = adapterConfig.accounts[accountKey];
    const api = getApiInstance(accountKey, accountConfig);

    if (typeof accountInfo[accountKey] === 'undefined') {
        accountInfo[accountKey] = new toodledo.AccountInfo(api);

        accountInfo[accountKey]
            .on('error', (exception) => {
                if (exception.name === 'INVALID_ACCESS_TOKEN' || exception.name === 'NO_ACCESS_TOKEN') {
                    api.refreshAccessToken()
                        .then(() => {
                            accountInfo[accountKey].fetch();
                        });
                }
            })
            .on('account-info:loaded', () => {
                accounts[accountKey] = accountInfo[accountKey].data;
                accounts[accountKey]['_retrieved'] = Date.now();
                fs.writeFileSync('data/adapters/toodledo/account-info.json', JSON.stringify(accounts, null, 4));
            });
    }

    if (accounts[accountKey] && (accounts[accountKey]['_retrieved'] + FIVE_MINUTES) >= Date.now()) {
        response.send(JSON.stringify(accounts[accountKey]));
    } else {
        accountInfo[accountKey].once('account-info:loaded', () => {
            response.send(JSON.stringify(accountInfo[accountKey].data, null, 4));
        });
        accountInfo[accountKey].fetch();
    }
});

module.exports = router;
