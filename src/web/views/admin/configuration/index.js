'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    Object.keys(adapters).forEach((key) => {
        try {
            adapters[key].accounts = JSON.parse(fs.readFileSync(`data/adapters/${key}/accounts.json`));
        } catch (error) {
            if (error.code === 'ENOENT') {
                adapters[key].accounts = {};
            } else {
                throw error;
            }
        }
    });

    render('admin/configuration/index.hbs', response, {
        'adapters': adapters
    });
});

router.get('/add-account/*', (request, response) => {
    const configPath = request.path.replace(/^\/add-account\/(.+)\/$/, '$1') + '.json';
    const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}`));
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    let adapter;

    adapter = {};
    Object.keys(adapters).forEach((key) => {
        if (adapters[key]['config-file'] === configPath) {
            adapter = adapters[key];
            adapter.key = key;
        }
    });

    render('admin/configuration/adapter/index.hbs', response, {
        'adapter': adapter,
        'accountConfig': adapterConfig['account-template'],
        'accountData': {}
    });
});

// display the edit page for an account
router.get('/edit-account/*', (request, response) => {
    const configPath = request.path.replace(/^\/edit-account\/([^\/]+)\/.+\/$/, '$1');
    const accountSlug = request.path.replace(/^\/edit-account\/[^\/]+\/(.+)\/$/, '$1');
    const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}.json`));
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    let accounts;
    try {
        accounts = JSON.parse(fs.readFileSync(`data/adapters/${configPath}/accounts.json`));
    } catch (error) {
        if (error.code === 'ENOENT') {
            accounts = {};
        } else {
            throw error;
        }
    }

    let adapter;

    adapter = {};
    Object.keys(adapters).forEach((key) => {
        if (adapters[key]['config-file'] === `${ configPath }.json`) {
            adapter = adapters[key];
            adapter.key = key;
        }
    });

    let account;

    account = accounts[accountSlug];
    account.slug = accountSlug;

    render('admin/configuration/adapter/index.hbs', response, {
        'adapter': adapter,
        'accountConfig': adapterConfig['account-template'],
        'accountData': account,
        'showSavedMsg': request.query.hasOwnProperty('saved')
    });
});

// add a new account
router.post(
    '/edit-account/*',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
        if (!request.body) {
            return response.sendStatus(400);
        }

        const configPath = request.path.replace(/^\/edit-account\/(.+)\/$/, '$1');
        const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}.json`));

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(`data/adapters/${configPath}/accounts.json`));
        } catch (error) {
            if (error.code === 'ENOENT') {
                accounts = {};
            } else {
                throw error;
            }
        }

        const body = request.body;

        const account = {};
        const accountSlug = body['account-slug'];
        account.name = body['account-name'];

        if (body['account-slug-previous'] !== '' && accountSlug !== body['account-slug-previous']) {
            delete accounts[body['account-slug-previous']];
        }

        delete body['account-name'];
        delete body['account-slug'];
        delete body['account-slug-previous'];

        account.fields = body;
        account.data = adapterConfig['account-template'].data;

        accounts[accountSlug] = account;

        fs.writeFileSync(`data/adapters/${configPath}/accounts.json`, JSON.stringify(accounts, null, 4));

        response.redirect(`/admin/configuration/edit-account/${configPath}/${accountSlug}/?saved`);
    }
);

router.put(
    '/enable/*',
    (request, response) => {
        console.log('hit enable');
        response.send('enabled');
    }
);

router.put(
    '/disable/*',
    (request, response) => {
        console.log('hit disable');
        response.send('disabled');
    }
);

module.exports = router;
