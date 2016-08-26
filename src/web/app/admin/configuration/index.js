'use strict';

const express = require('express');
const render = require('../../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

const adapters = require('../../../../../config/adapters.json');

router.get('/', (request, response) => {
    render('admin/configuration/index.hbs', response, {
        'adapters': adapters
    });
});

router.get('/:adapter*', (request, response) => {
    const configPath = request.path.replace(/^\/(.+)\/$/, '$1') + '.json';
    const adapterConfig = require(`../../../../../config/adapters/${configPath}`);

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

module.exports = router;
