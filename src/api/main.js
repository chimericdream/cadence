'use strict';

const _ = require('lodash');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const shards = require('./shards/index');
const plugins = require('./plugins/index');
const widgets = require('./widgets/index');

router.use('/shards', shards.router);
router.use('/plugins', plugins.router);
router.use('/widgets', widgets.router);

module.exports = {
    'router': router,
    'dataFiles': _.concat([
            'config/config.json'
        ],
        shards.dataFiles,
        plugins.dataFiles,
        widgets.dataFiles
    ),
    'dataDirs': _.concat([],
        shards.dataDirs,
        plugins.dataDirs,
        widgets.dataDirs
    )
};
