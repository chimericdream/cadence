'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const contexts = JSON.parse(fs.readFileSync(`data/contexts.json`));
    render('contexts/index.hbs', response, {
        'contexts': contexts,
        'showSavedMsg': request.query.hasOwnProperty('saved')
    });
});

router.get('/add', (request, response) => {
    render('contexts/add.hbs', response);
});

router.get('/edit/:id', (request, response) => {
    const contexts = JSON.parse(fs.readFileSync(`data/contexts.json`));
    if (!contexts.hasOwnProperty(request.params.id)) {
        // TODO: Make a "context not found" template
        response.status(404).send('');
    }
    render('contexts/edit.hbs', response, {'context': contexts[request.params.id]});
});

router.post('/edit/:id', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
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
    const typeValue = `context-value-${context.type}`;

    context.description = body['context-description'];
    context.value = body[typeValue];
    context.updated = Date.now();

    history.push({
        "value": context.value,
        "updated": context.updated
    });

    contexts[context.id] = context;

    fs.writeFileSync(`data/contexts.json`, JSON.stringify(contexts, null, 4));
    fs.writeFileSync(`data/contexts/${ context.id }.json`, JSON.stringify(history, null, 4));

    response.redirect(`/contexts/?saved`);
});

router.post('/add', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const contexts = JSON.parse(fs.readFileSync(`data/contexts.json`));
    const body = request.body;

    const typeValue = `context-value-${body['context-type']}`;
    const context = {
        'id': body['context-id'],
        'description': body['context-description'],
        'type': body['context-type'],
        'value': body[typeValue],
        'updated': Date.now()
    };

    if (typeof contexts[context.id] !== 'undefined') {
        throw 'You cannot have two contexts with the same id';
    }
    contexts[context.id] = context;

    fs.writeFileSync(`data/contexts.json`, JSON.stringify(contexts, null, 4));
    fs.writeFileSync(`data/contexts/${ context.id }.json`, JSON.stringify([{
        "value": context.value,
        "updated": context.updated
    }], null, 4));

    response.redirect(`/contexts/?saved`);
});

module.exports = router;
