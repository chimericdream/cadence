'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    response.json(shards);
});

router.get('/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    const shard = shards[request.params.id];
    if (typeof shard === 'undefined') {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
        return;
    }
    response.json(shard);
});

router.delete('/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    const shard = shards[request.params.id];
    if (typeof shard === 'undefined') {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
        return;
    }

    delete shards[request.params.id];
    fs.unlinkSync(`data/shards/${ shard.id }.json`);
    fs.writeFileSync('data/shards.json', JSON.stringify(shards, null, 4));

    response.status(204).end();
});

router.get('/history/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    const shard = shards[request.params.id];
    if (typeof shard === 'undefined') {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
        return;
    }
    const history = JSON.parse(fs.readFileSync(`data/shards/${ shard.id }.json`));
    response.json(history);
});

router.put(
    '/:id',
    bodyParser.json(),
    (request, response) => {
        if (!request.body) {
            // TODO: error message
            return response.status(400).end();
        }

        const shards = JSON.parse(fs.readFileSync('data/shards.json'));
        const shard = request.body;

        let history;
        if (typeof shards[shard.id] === 'undefined') {
            history = [];
        } else {
            history = JSON.parse(fs.readFileSync(`data/shards/${ shard.id }.json`));
        }

        history.push({
            'value': shard.value,
            'updated': shard.updated
        });

        shards[shard.id] = shard;

        fs.writeFileSync('data/shards.json', JSON.stringify(shards, null, 4));
        fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

        response.status(204).end();
    }
);

module.exports = router;
