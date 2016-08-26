'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

    render('admin/configuration/index.hbs', response, {
        'adapters': adapters
    });
});

router.get('/:adapter*', (request, response) => {
    const configPath = request.path.replace(/^\/(.+)\/$/, '$1') + '.json';
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
        'config': adapterConfig
    });
});

router.post(
    '/*',
    bodyParser.urlencoded({ 'extended': false }),
    (request, response) => {
        if (!request.body) {
            return response.sendStatus(400);
        }

        const configPath = request.path.replace(/^\/(.+)\/$/, '$1') + '.json';
        const adapterConfig = JSON.parse(fs.readFileSync(`config/adapters/${configPath}`));
        const adapters = JSON.parse(fs.readFileSync('config/adapters.json'));

        let adapter;

        adapter = {};
        adapters.forEach((item) => {
            if (item['config-file-path'] === configPath) {
                adapter = item;
            }
        });

        if (request.body.scopes) {
            adapterConfig.scopes.value = [].concat(request.body.scopes);
        }
        adapterConfig['client-id'].value = request.body['client-id'];
        adapterConfig['client-secret'].value = request.body['client-secret'];
        fs.writeFileSync(`config/adapters/${configPath}`, JSON.stringify(adapterConfig, null, 4));

        render('admin/configuration/adapter/index.hbs', response, {
            'adapter': adapter,
            'config': adapterConfig
        });
    }
);

module.exports = router;
