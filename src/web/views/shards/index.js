'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
    render('shards/index.hbs', response, {
        'shards': shards,
        'showSavedMsg': request.query.hasOwnProperty('saved')
    });
});

router.get('/add', (request, response) => {
    render('shards/add.hbs', response);
});

router.get('/edit/:id', (request, response) => {
    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
    if (!shards.hasOwnProperty(request.params.id)) {
        // TODO: Make a "shard not found" template
        response.status(404).send('');
    }
    render('shards/edit.hbs', response, {'shard': shards[request.params.id]});
});

router.post('/edit/:id', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
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
    const typeValue = `shard-value-${shard.type}`;

    shard.description = body['shard-description'];
    shard.value = body[typeValue];
    shard.updated = Date.now();

    history.push({
        "value": shard.value,
        "updated": shard.updated
    });

    shards[shard.id] = shard;

    fs.writeFileSync(`data/shards.json`, JSON.stringify(shards, null, 4));
    fs.writeFileSync(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

    response.redirect(`/shards/?saved`);
});

router.post('/add', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const shards = JSON.parse(fs.readFileSync(`data/shards.json`));
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
        "value": shard.value,
        "updated": shard.updated
    }];

    fs.writeFileSync(
        `data/shards.json`,
        JSON.stringify(shards, null, 4)
    );
    fs.writeFileSync(
        `data/shards/${ shard.id }.json`,
        JSON.stringify(history, null, 4)
    );

    response.redirect(`/shards/?saved`);
});

module.exports = router;
