'use strict';

const _ = require('lodash');
const express = require('express');
const fsp = require('fs-promise');
const getJson = require('../../../helpers/get-json');
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
            fsp.readFile('config/plugins/toodledo.json')
                .then((data) => {
                    const pluginConfig = getJson(data);
                    pluginConfig.accounts[key].data = tokens;
                    fsp.writeFile('config/plugins/toodledo.json', JSON.stringify(pluginConfig, null, 4));
                })
        });
    }
    return apiInstances[key];
}

function getAccountInfoInstance(key, api) {
    if (typeof accountInfo[key] === 'undefined') {
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
                fsp.readFile('data/plugins/toodledo/account-info.json')
                    .then((data) => {
                        const accounts = getJson(data);

                        accounts[key] = accountInfo[key].data;
                        accounts[key]['_retrieved'] = Date.now();

                        fsp.writeFile('data/plugins/toodledo/account-info.json', JSON.stringify(accounts, null, 4));
                    });
            });
    }
    return accountInfo[key];
}

// TODO: Refactor this so that each plugin specifies the pieces of data it
// provides. Then, the higher-level API call can do this call for any plugin
router.get('/data/:account/', (request, response) => {
    const accountKey = request.params.account;
    fsp.readFile('data/plugins/toodledo/account-info.json')
        .then((data) => {
            const accounts = getJson(data);
            response.send(JSON.stringify({
                'account-info': accounts[accountKey] || {}
            }));
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// TODO
router.get('/authorize/:account/', (request, response) => {
    response.send('make the initial authorization request');
});

router.get('/account-info/:account/', (request, response) => {
    const accountKey = request.params.account;
    let accounts, pluginConfig;

    const accountPromise = fsp.readFile('data/plugins/toodledo/account-info.json')
        .then((data) => {
            accounts = getJson(data);
        });
    const pluginConfigPromise = fsp.readFile('config/plugins/toodledo.json')
        .then((data) => {
            pluginConfig = getJson(data);
        });

    Promise.all([accountPromise, pluginConfigPromise])
        .then(() => {
            if (accounts[accountKey] && (accounts[accountKey]['_retrieved'] + FIVE_MINUTES) >= Date.now()) {
                response.send(JSON.stringify(accounts[accountKey]));
                return;
            }

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
});

// TODO: Refactor this so that each plugin specifies the pieces of data it
// provides. Then, the higher-level API call can do this call for any plugin
// delete account
router.delete('/accounts/:account', (request, response) => {
    const account = request.params.account;
    let accounts, accountInfoObj;
    const accountPromise = fsp.readFile('data/plugins/toodledo/accounts.json')
        .then((data) => {
            accounts = getJson(data);
            return Promise.resolve();
        });
    const accountInfoPromise = fsp.readFile('data/plugins/toodledo/account-info.json')
        .then((data) => {
            accountInfoObj = getJson(data);
            return Promise.resolve();
        });

    Promise.all([accountPromise, accountInfoPromise])
        .then(() => {
            if (typeof accounts[account] === 'undefined') {
                response.sendStatus(404);
                return;
            }

            delete accountInfoObj[account];
            delete accounts[account];

            const accountPromise2 = fsp.writeFile('data/plugins/toodledo/accounts.json', JSON.stringify(accounts, null, 4));
            const accountInfoPromise2 = fsp.writeFile('data/plugins/toodledo/account-info.json', JSON.stringify(accountInfoObj, null, 4));

            Promise.all([accountPromise2, accountInfoPromise2])
                .then(() => {
                    response.sendStatus(204);
                });
        });
});

module.exports = {
    'router': router,
    'dataFiles': [
        'config/plugins/toodledo.json',
        'data/plugins/toodledo/accounts.json',
        'data/plugins/toodledo/account-info.json'
    ],
    'dataDirs': []
};
