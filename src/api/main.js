'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const shards = require('./shards/index');
const plugins = require('./plugins/index');

router.use('/shards', shards);
router.use('/plugins', plugins);

module.exports = router;
