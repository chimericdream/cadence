'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    adapters.forEach((adapter) => {
        const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${adapter['config-file-path']}`));
        adapter.accounts = adapterConfig.accounts;
    });

    render('admin/configuration/index.hbs', response, {
        'adapters': adapters
    });
});

router.get('/add/*', (request, response) => {
    const configPath = request.path.replace(/^\/add\/(.+)\/$/, '$1') + '.json';
    const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}`));
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    let adapter;

    adapter = {};
    adapters.forEach((item) => {
        if (item['config-file-path'] === configPath) {
            adapter = item;
        }
    });

    render('admin/configuration/adapter/index.hbs', response, {
        'adapter': adapter,
        'accountConfig': adapterConfig['account-template'],
        'accountData': {}
    });
});

// display the edit page for an account
router.get('/edit/*', (request, response) => {
    const accountSlug = request.path.replace(/^\/edit\/([^\/]+)\/.+\/$/, '$1');
    const configPath = request.path.replace(/^\/edit\/[^\/]+\/(.+)\/$/, '$1');
    const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}.json`));
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    let adapter;

    adapter = {};
    adapters.forEach((item) => {
        if (item['config-file-path'] === `${ configPath }.json`) {
            adapter = item;
        }
    });

    render('admin/configuration/adapter/index.hbs', response, {
        'adapter': adapter,
        'accountConfig': adapterConfig['account-template'],
        'accountData': adapterConfig.accounts[accountSlug]
    });
});

// add a new account
router.post(
    '/edit/*',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
        if (!request.body) {
            return response.sendStatus(400);
        }

        const configPath = request.path.replace(/^\/edit\/(.+)\/$/, '$1');
        const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}.json`));
        const body = request.body;

        const account = {};
        account.name = body['account-name'];
        account.slug = body['account-slug'];

        if (body['account-slug-previous'] !== '' && account.slug !== body['account-slug-previous']) {
            delete adapterConfig.accounts[body['account-slug-previous']];
        }

        delete body['account-name'];
        delete body['account-slug'];
        delete body['account-slug-previous'];

        account.fields = body;
        account.data = adapterConfig['account-template'].data;

        adapterConfig.accounts[account.slug] = account;

        fs.writeFileSync(`config/adapters/${configPath}.json`, JSON.stringify(adapterConfig, null, 4));

        response.redirect(`/admin/configuration/edit/${account.slug}/${configPath}/`);
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
