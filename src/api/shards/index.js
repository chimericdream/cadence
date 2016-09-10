'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/history/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
    if (!shards.hasOwnProperty(request.params.id)) {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
    }
    const history = JSON.parse(fs.readFileSync(`data/shards/${ request.params.id }.json`));
    response.json(history);
});

router.get('/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
    if (!shards.hasOwnProperty(request.params.id)) {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
    }
    response.json(shards[request.params.id]);
});

router.post('/:id', bodyParser.json(), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
    if (!shards.hasOwnProperty(request.params.id)) {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
    }

    const body = request.body;
    const shard = shards[request.params.id];
    const history = JSON.parse(fs.readFileSync(`data/shards/${ shard.id }.json`));

    shard.value = body.value;
    shard.updated = Date.now();

    history.push({
        "value": shard.value,
        "updated": shard.updated
    });

    shards[shard.id] = shard;

    fs.writeFileSync(`data/shards.json`, JSON.stringify(shards, null, 4));
    fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

    response.status(200).end();
});

module.exports = router;
