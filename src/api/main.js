'use strict';

const _ = require('lodash');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const shards = require('./shards/index');
const plugins = require('./plugins/index');

router.use('/shards', shards.router);
router.use('/plugins', plugins.router);

module.exports = {
    'router': router,
    'dataFiles': _.concat([
            'config/config.json'
        ],
        shards.dataFiles,
        plugins.dataFiles
    ),
    'dataDirs': _.concat([],
        shards.dataDirs,
        plugins.dataDirs
    )
};
