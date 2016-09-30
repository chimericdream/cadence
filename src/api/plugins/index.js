'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fsp = require('fs-promise');
const getJson = require('../../helpers/get-json');

// eslint-disable-next-line new-cap
const router = express.Router();

const google = require('./google/index');
const toodledo = require('./toodledo/index');

router.use('/google', google.router);
router.use('/toodledo', toodledo.router);

// get all plugins
// TODO: [Refactor] This method and the one below it are nearly identical.
router.get('/', (request, response) => {
    let plugins;

    fsp.readFile('config/plugins.json')
        .then((data) => {
            const promises = [];

            plugins = getJson(data);

            Object.keys(plugins).forEach((key) => {
                promises.push(
                    fsp.readFile(`data/plugins/${ key }/accounts.json`)
                        .then((accountData) => {
                            plugins[key].accounts = getJson(accountData);
                        })
                        .catch(() => {
                            plugins[key].accounts = {};
                        })
                );
            });

            return Promise.all(promises);
        })
        .then(() => {
            response.json(plugins);
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// get one plugin
router.get('/:plugin', (request, response) => {
    const key = request.params.plugin;

    let plugins, pluginConfig, accounts, status;

    const pluginPromise = fsp.readFile('config/plugins.json')
        .then((data) => {
            plugins = getJson(data);
        });

    const configPromise = fsp.readFile(`config/plugins/${ key }.json`)
        .then((data) => {
            pluginConfig = getJson(data);
        });

    const accountPromise = fsp.readFile(`data/plugins/${ key }/accounts.json`)
        .then((data) => {
            accounts = getJson(data);
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                accounts = {};
                return Promise.resolve();
            } else {
                return Promise.reject(error);
            }
        });

    Promise.all([pluginPromise, configPromise, accountPromise])
        .then(() => {
            const plugin = plugins[key];
            plugin.accounts = accounts;
            plugin.config = pluginConfig;

            response.json(plugin);
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// enable a plugin
router.put('/:plugin/enable', (request, response) => {
    fsp.readFile('config/plugins.json')
        .then((data) => {
            const plugins = getJson(data);
            plugins[request.params.plugin].enabled = true;
            return fsp.writeFile('config/plugins.json', JSON.stringify(plugins, null, 4));
        })
        .then(() => {
            response.status(200).end();
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// disable a plugin
router.put('/:plugin/disable', (request, response) => {
    fsp.readFile('config/plugins.json')
        .then((data) => {
            const plugins = getJson(data);
            plugins[request.params.plugin].enabled = false;
            return fsp.writeFile('config/plugins.json', JSON.stringify(plugins, null, 4));
        })
        .then(() => {
            response.status(200).end();
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// get all accounts
router.get('/:plugin/accounts', (request, response) => {
    const plugin = request.params.plugin;
    fsp.readFile(`data/plugins/${ plugin }/accounts.json`)
        .then((data) => {
            response.json(getJson(data));
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// get template used when creating an account
router.get('/:plugin/account-template', (request, response) => {
    const plugin = request.params.plugin;
    fsp.readFile(`config/plugins/${ plugin }.json`)
        .then((data) => {
            response.json(getJson(data));
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

function saveAccount(plugin, accountId, body, response) {
    let plugins, pluginConfig, accounts, status;

    const pluginPromise = fsp.readFile('config/plugins.json')
        .then((data) => {
            plugins = getJson(data);
        });

    const configPromise = fsp.readFile(`config/plugins/${ plugin }.json`)
        .then((data) => {
            pluginConfig = getJson(data);
        });

    const accountPromise = fsp.readFile(`data/plugins/${ plugin }/accounts.json`)
        .then((data) => {
            accounts = getJson(data);
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                accounts = {};
                return Promise.resolve();
            } else {
                return Promise.reject(error);
            }
        });

    Promise.all([pluginPromise, configPromise, accountPromise])
        .then(() => {
            const account = {};

            account.fields = body;
            account.data = pluginConfig['account-template'].data;

            if (typeof accounts[accountId] === 'undefined') {
                status = 201;
            } else {
                status = 204;
            }

            accounts[accountId] = account;

            return fsp.writeFile(`data/plugins/${ plugin }/accounts.json`, JSON.stringify(accounts, null, 4));
        })
        .then(() => {
            response.status(status)
                .set({
                    'X-Cadence-Account-ID': accountId,
                    'X-Cadence-Plugin': plugins[plugin].name
                })
                .end();
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
}

// add account
router.post(
    '/:plugin/add-account',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
        if (!request.body) {
            response.sendStatus(400);
            return;
        }

        const plugin = request.params.plugin;
        const body = request.body;
        const accountId = body['account-id'];
        delete body['account-id'];

        saveAccount(plugin, accountId, body, response);
    });

// view account
router.get('/:plugin/accounts/:account', (request, response) => {
    const plugin = request.params.plugin;
    fsp.readFile(`data/plugins/${ plugin }/accounts.json`)
        .then((data) => {
            const accounts = getJson(data);
            const account = request.params.account;

            response.json(accounts[account]);
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

// edit account
router.post(
    '/:plugin/accounts/:account',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
    if (!request.body) {
        response.sendStatus(400);
        return;
    }

    const plugin = request.params.plugin;
    const accountId = request.params.account;
    saveAccount(plugin, accountId, request.body, response);
});

module.exports = {
    'router': router,
    'dataFiles': _.concat([
            'config/plugins.json'
        ],
        google.dataFiles,
        toodledo.dataFiles
    ),
    'dataDirs': _.concat([],
        google.dataDirs,
        toodledo.dataDirs
    )
};
