'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/add-account/*', (request, response) => {
    const configPath = request.path.replace(/^\/add-account\/(.+)\/$/, '$1') + '.json';
    const pluginConfig = JSON.parse(fs.readFileSync(`config/plugins/${configPath}`));
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    let plugin;

    plugin = {};
    Object.keys(plugins).forEach((key) => {
        if (plugins[key]['config-file'] === configPath) {
            plugin = plugins[key];
            plugin.key = key;
        }
    });

    render('plugins/plugin/index.hbs', response, {
        'plugin': plugin,
        'accountConfig': pluginConfig['account-template'],
        'accountData': {}
    });
});

// display the edit page for an account
router.get('/edit-account/:plugin/:account/', (request, response) => {
    const configPath = request.params.plugin;
    const accountSlug = request.params.account;
    const pluginConfig = JSON.parse(fs.readFileSync(`config/plugins/${configPath}.json`));
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    let accounts;
    try {
        accounts = JSON.parse(fs.readFileSync(`data/plugins/${configPath}/accounts.json`));
    } catch (error) {
        if (error.code === 'ENOENT') {
            accounts = {};
        } else {
            throw error;
        }
    }

    let plugin;

    plugin = {};
    Object.keys(plugins).forEach((key) => {
        if (plugins[key]['config-file'] === `${ configPath }.json`) {
            plugin = plugins[key];
            plugin.key = key;
        }
    });

    let account;

    account = accounts[accountSlug];
    account.slug = accountSlug;

    render('plugins/plugin/index.hbs', response, {
        'plugin': plugin,
        'accountConfig': pluginConfig['account-template'],
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
        const pluginConfig = JSON.parse(fs.readFileSync(`config/plugins/${configPath}.json`));

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(`data/plugins/${configPath}/accounts.json`));
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
        account.data = pluginConfig['account-template'].data;

        accounts[accountSlug] = account;

        fs.writeFileSync(`data/plugins/${configPath}/accounts.json`, JSON.stringify(accounts, null, 4));

        response.redirect(`/plugins/edit-account/${configPath}/${accountSlug}/?saved`);
    }
);

module.exports = router;
