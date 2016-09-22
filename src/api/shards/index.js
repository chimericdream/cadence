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

router.post('/edit/:id', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    const shard = shards[request.params.id];
    if (typeof shard === 'undefined') {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
        return;
    }

    const body = request.body;

    const history = JSON.parse(fs.readFileSync(`data/shards/${ shard.id }.json`));
    const typeValue = `shard-value-${ shard.type }`;

    shard.description = body['shard-description'];
    shard.value = (shard.type === 'json') ? JSON.parse(body[typeValue]) : body[typeValue];
    shard.updated = Date.now();

    history.push({
        'value': shard.value,
        'updated': shard.updated
    });

    shards[shard.id] = shard;

    fs.writeFileSync('data/shards.json', JSON.stringify(shards, null, 4));
    fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

    response.redirect(`/shards/?saved`);
});

router.post('/add', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const shards = JSON.parse(fs.readFileSync('data/shards.json'));
    const body = request.body;

    const typeValue = `shard-value-${body['shard-type']}`;
    const shard = {
        'id': body['shard-id'],
        'description': body['shard-description'],
        'type': body['shard-type'],
        'value': (body['shard-type'] === 'json') ? JSON.parse(body[typeValue]) : body[typeValue],
        'updated': Date.now()
    };

    if (typeof shards[shard.id] !== 'undefined') {
        throw 'You cannot have two shards with the same id';
    }
    shards[shard.id] = shard;

    const history = [{
        'value': shard.value,
        'updated': shard.updated
    }];

    fs.writeFileSync('data/shards.json', JSON.stringify(shards, null, 4));
    fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

    response.status(201).end();
});

module.exports = router;
