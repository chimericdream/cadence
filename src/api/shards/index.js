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

        if (typeof shards[request.params.id] === 'undefined') {
            // TODO: Make a "shard not found" template
            response.status(404).send('');
            return;
        }

        if (shard.id !== request.params.id) {
            // TODO: error message
            return response.status(400).end();
        }

        const history = JSON.parse(fs.readFileSync(`data/shards/${ shard.id }.json`));
        const typeValue = `shard-value-${ shard.type }`;

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

router.post(
    '/add',
    bodyParser.json(),
    (request, response) => {
        if (!request.body) {
            // TODO: error message
            return response.status(400).end();
        }

        const shards = JSON.parse(fs.readFileSync('data/shards.json'));
        const shard = request.body;

        if (typeof shards[shard.id] !== 'undefined') {
            // TODO: send this back with the response
            console.log('You cannot have two shards with the same id');
            return response.status(400).end();
        }
        shards[shard.id] = shard;

        const history = [{
            'value': shard.value,
            'updated': shard.updated
        }];

        fs.writeFileSync('data/shards.json', JSON.stringify(shards, null, 4));
        fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

        response.status(201).end();
    }
);

module.exports = router;
