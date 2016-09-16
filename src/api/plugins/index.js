'use strict';

const express = require('express');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

const google = require('./google/index');
const toodledo = require('./toodledo/index');

router.use('/google', google);
router.use('/toodledo', toodledo);

router.get('/', (request, response) => {
    const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

    Object.keys(plugins).forEach((key) => {
        try {
            plugins[key].accounts = JSON.parse(fs.readFileSync(`data/plugins/${key}/accounts.json`));
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
        plugins[key].accounts = JSON.parse(fs.readFileSync(`data/plugins/${key}/accounts.json`));
    } catch (error) {
        if (error.code === 'ENOENT') {
            plugins[key].accounts = {};
        } else {
            throw error;
        }
    }

    response.json(plugins[key]);
});

router.get('/:plugin/config', (request, response) => {
    try {
        const plugin = request.params.plugin;
        const config = JSON.parse(fs.readFileSync(`config/plugins/${plugin}.json`));

        response.json(config);
    } catch (error) {
        // TODO
    }
});

router.put(
    '/:plugin/enable',
    (request, response) => {
        const plugin = request.params.plugin;
        const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

        plugins[plugin].enabled = true;
        fs.writeFileSync(`config/plugins.json`, JSON.stringify(plugins, null, 4));

        response.status(200).end();
    }
);

router.put(
    '/:plugin/disable',
    (request, response) => {
        const plugin = request.params.plugin;
        const plugins = JSON.parse(fs.readFileSync('config/plugins.json'));

        plugins[plugin].enabled = false;
        fs.writeFileSync(`config/plugins.json`, JSON.stringify(plugins, null, 4));

        response.status(200).end();
    }
);

module.exports = router;
