'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const bridges = JSON.parse(fs.readFileSync('config/bridges.json'));

    Object.keys(bridges).forEach((key) => {
        try {
            bridges[key].accounts = JSON.parse(fs.readFileSync(`data/bridges/${key}/accounts.json`));
        } catch (error) {
            if (error.code === 'ENOENT') {
                bridges[key].accounts = {};
            } else {
                throw error;
            }
        }
    });

    render('admin/bridges/index.hbs', response, {
        'bridges': bridges
    });
});

router.get('/add-account/*', (request, response) => {
    const configPath = request.path.replace(/^\/add-account\/(.+)\/$/, '$1') + '.json';
    const bridgeConfig = JSON.parse(fs.readFileSync(`config/bridges/${configPath}`));
    const bridges = JSON.parse(fs.readFileSync('config/bridges.json'));

    let bridge;

    bridge = {};
    Object.keys(bridges).forEach((key) => {
        if (bridges[key]['config-file'] === configPath) {
            bridge = bridges[key];
            bridge.key = key;
        }
    });

    render('admin/bridges/bridge/index.hbs', response, {
        'bridge': bridge,
        'accountConfig': bridgeConfig['account-template'],
        'accountData': {}
    });
});

// display the edit page for an account
router.get('/edit-account/*', (request, response) => {
    const configPath = request.path.replace(/^\/edit-account\/([^\/]+)\/.+\/$/, '$1');
    const accountSlug = request.path.replace(/^\/edit-account\/[^\/]+\/(.+)\/$/, '$1');
    const bridgeConfig = JSON.parse(fs.readFileSync(`config/bridges/${configPath}.json`));
    const bridges = JSON.parse(fs.readFileSync('config/bridges.json'));

    let accounts;
    try {
        accounts = JSON.parse(fs.readFileSync(`data/bridges/${configPath}/accounts.json`));
    } catch (error) {
        if (error.code === 'ENOENT') {
            accounts = {};
        } else {
            throw error;
        }
    }

    let bridge;

    bridge = {};
    Object.keys(bridges).forEach((key) => {
        if (bridges[key]['config-file'] === `${ configPath }.json`) {
            bridge = bridges[key];
            bridge.key = key;
        }
    });

    let account;

    account = accounts[accountSlug];
    account.slug = accountSlug;

    render('admin/bridges/bridge/index.hbs', response, {
        'bridge': bridge,
        'accountConfig': bridgeConfig['account-template'],
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
        const bridgeConfig = JSON.parse(fs.readFileSync(`config/bridges/${configPath}.json`));

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(`data/bridges/${configPath}/accounts.json`));
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
        account.data = bridgeConfig['account-template'].data;

        accounts[accountSlug] = account;

        fs.writeFileSync(`data/bridges/${configPath}/accounts.json`, JSON.stringify(accounts, null, 4));

        response.redirect(`/admin/bridges/edit-account/${configPath}/${accountSlug}/?saved`);
    }
);

router.put(
    '/enable/*',
    (request, response) => {
        const bridge = request.path.replace(/^\/enable\/(.+)\/$/, '$1');
        const bridges = JSON.parse(fs.readFileSync('config/bridges.json'));

        bridges[bridge].enabled = true;
        fs.writeFileSync(`config/bridges.json`, JSON.stringify(bridges, null, 4));

        response.status(200).end();
    }
);

router.put(
    '/disable/*',
    (request, response) => {
        const bridge = request.path.replace(/^\/disable\/(.+)\/$/, '$1');
        const bridges = JSON.parse(fs.readFileSync('config/bridges.json'));

        bridges[bridge].enabled = false;
        fs.writeFileSync(`config/bridges.json`, JSON.stringify(bridges, null, 4));

        response.status(200).end();
    }
);

module.exports = router;
