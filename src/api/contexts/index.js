'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/:id', (request, response) => {
    const contexts = JSON.parse(fs.readFileSync(`data/contexts.json`));
    if (!contexts.hasOwnProperty(request.params.id)) {
        // TODO: Make a "context not found" template
        response.status(404).send('');
    }
    response.json(contexts[request.params.id]);
});

router.post('/:id', bodyParser.json(), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const contexts = JSON.parse(fs.readFileSync(`data/contexts.json`));
    if (!contexts.hasOwnProperty(request.params.id)) {
        // TODO: Make a "context not found" template
        response.status(404).send('');
    }

    const body = request.body;
    const context = contexts[request.params.id];
    const history = JSON.parse(fs.readFileSync(`data/contexts/${ context.id }.json`));

    context.value = body.value;
    context.updated = Date.now();

    history.push({
        "description": context.description,
        "value": context.value,
        "updated": context.updated
    });

    contexts[context.id] = context;

    fs.writeFileSync(`data/contexts.json`, JSON.stringify(contexts, null, 4));
    fs.writeFileSync(`data/contexts/${ context.id }.json`, JSON.stringify(history, null, 4));

    response.status(200).end();
});

module.exports = router;
