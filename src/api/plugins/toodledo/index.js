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
            const pluginConfig = JSON.parse(fs.readFileSync('config/plugins/toodledo.json'));
            pluginConfig.accounts[key].data = tokens;
            fs.writeFileSync('config/plugins/toodledo.json', JSON.stringify(pluginConfig, null, 4));
        });
    }
    return apiInstances[key];
}

function getAccountInfoInstance(key, api) {
    if (typeof accountInfo[key] === 'undefined') {
        const accounts = JSON.parse(fs.readFileSync('data/plugins/toodledo/account-info.json'));

        accountInfo[key] = new toodledo.AccountInfo(api);

        accountInfo[key]
            .on('error', (exception) => {
                if (exception.name === 'INVALID_ACCESS_TOKEN' || exception.name === 'NO_ACCESS_TOKEN') {
                    api.refreshAccessToken()
                        .then(() => {
                            accountInfo[key].fetch();
                        });
                }
            })
            .on('account-info:loaded', () => {
                accounts[key] = accountInfo[key].data;
                accounts[key]['_retrieved'] = Date.now();
                fs.writeFileSync('data/plugins/toodledo/account-info.json', JSON.stringify(accounts, null, 4));
            });
    }
    return accountInfo[key];
}

router.get('/data/:account/', (request, response) => {
    const accountKey = request.params.account;
    const accounts = JSON.parse(fs.readFileSync('data/plugins/toodledo/account-info.json'));
    response.send(JSON.stringify({
        'account-info': accounts[accountKey] || {}
    }));
});

router.get('/authorize/:account/', (request, response) => {
    response.send('make the initial authorization request');
});

router.get('/account-info/:account/', (request, response) => {
    const accountKey = request.params.account;
    const accounts = JSON.parse(fs.readFileSync('data/plugins/toodledo/account-info.json'));

    if (accounts[accountKey] && (accounts[accountKey]['_retrieved'] + FIVE_MINUTES) >= Date.now()) {
        response.send(JSON.stringify(accounts[accountKey]));
        return;
    }

    const pluginConfig = JSON.parse(fs.readFileSync('config/plugins/toodledo.json'));
    if (!pluginConfig.accounts.hasOwnProperty(accountKey)) {
        throw new Error('account not found');
    }

    const accountConfig = pluginConfig.accounts[accountKey];
    const api = getApiInstance(accountKey, accountConfig);
    const accountInfo = getAccountInfoInstance(accountKey, api);

    accountInfo.once('account-info:loaded', () => {
        response.send(JSON.stringify(accountInfo.data, null, 4));
    });
    accountInfo.fetch();
});

module.exports = router;
