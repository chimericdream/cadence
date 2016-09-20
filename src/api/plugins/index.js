'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

const google = require('./google/index');
const toodledo = require('./toodledo/index');

router.use('/google', google);
router.use('/toodledo', toodledo);

// TODO: [Refactor] This method and the one below it are nearly identical.
router.get('/', (request, response) => {
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    Object.keys(plugins).forEach((key) => {
        try {
            plugins[key].accounts = JSON.parse(fs.readFileSync(`data/plugins/${ key }/accounts.json`));
        } catch (error) {
            if (error.code === 'ENOENT') {
                plugins[key].accounts = {};
            } else {
                throw error;
            }
        }
    });

    response.json(plugins);
});

router.get('/:plugin', (request, response) => {
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));
    const key = request.params.plugin;

    try {
        plugins[key].accounts = JSON.parse(fs.readFileSync(`data/plugins/${ key }/accounts.json`));
    } catch (error) {
        if (error.code === 'ENOENT') {
            plugins[key].accounts = {};
        } else {
            throw error;
        }
    }

    response.json(plugins[key]);
});

router.put('/:plugin/enable', (request, response) => {
    const plugin = request.params.plugin;
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    plugins[plugin].enabled = true;
    fs.writeFileSync('config/plugins.json', JSON.stringify(plugins, null, 4));

    response.status(200).end();
});

router.put('/:plugin/disable', (request, response) => {
    const plugin = request.params.plugin;
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    plugins[plugin].enabled = false;
    fs.writeFileSync('config/plugins.json', JSON.stringify(plugins, null, 4));

    response.status(200).end();
});

// get all accounts
router.get('/:plugin/accounts', (request, response) => {
    const plugin = request.params.plugin;
    response.json(JSON.parse(fs.readFileSync(`data/plugins/${ plugin }/accounts.json`)));
});

// get template used when creating an account
router.get('/:plugin/account-template', (request, response) => {
    const plugin = request.params.plugin;
    response.json(JSON.parse(fs.readFileSync(`config/plugins/${ plugin }.json`)));
});

// add account
router.post(
    '/:plugin/add-account',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
        if (!request.body) {
            return response.sendStatus(400);
        }

        const plugin = request.params.plugin;
        const pluginConfig = JSON.parse(fs.readFileSync(`config/plugins/${ plugin }.json`));

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(`data/plugins/${ plugin }/accounts.json`));
        } catch (error) {
            if (error.code === 'ENOENT') {
                accounts = {};
            } else {
                throw error;
            }
        }

        const body = request.body;

        const account = {};
        const accountId = body['account-id'];

        delete body['account-id'];

        account.fields = body;
        account.data = pluginConfig['account-template'].data;

        accounts[accountId] = account;

        fs.writeFileSync(`data/plugins/${ plugin }/accounts.json`, JSON.stringify(accounts, null, 4));

        response.status(201)
            .set({
                'X-Cadence-Account-ID': accountId,
                'X-Cadence-Plugin': plugin
            })
            .end();
    });

// view account
router.get('/:plugin/accounts/:account', (request, response) => {
    const plugin = request.params.plugin;
    const account = request.params.account;
    const accounts = JSON.parse(fs.readFileSync(`data/plugins/${ plugin }/accounts.json`));

    response.json(accounts[account]);
});

// edit account
router.post('/:plugin/accounts/:account', (request, response) => {});

// delete account
router.delete('/:plugin/accounts/:account', (request, response) => {});

// get all data for account
router.get('/:plugin/accounts/:account/data', (request, response) => {});

module.exports = router;
