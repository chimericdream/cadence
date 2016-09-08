'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const render = require('../../../helpers/render');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    const repositories = JSON.parse(fs.readFileSync(`data/repositories.json`));
    render('repositories/index.hbs', response, {
        'repositories': repositories,
        'showSavedMsg': request.query.hasOwnProperty('saved')
    });
});

router.get('/add', (request, response) => {
    render('repositories/add.hbs', response);
});

router.get('/edit/:id', (request, response) => {
    const repositories = JSON.parse(fs.readFileSync(`data/repositories.json`));
    if (!repositories.hasOwnProperty(request.params.id)) {
        // TODO: Make a "repository not found" template
        response.status(404).send('');
    }
    render('repositories/edit.hbs', response, {'repositories': repositories[request.params.id]});
});

router.post('/edit/:id', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const repositories = JSON.parse(fs.readFileSync(`data/repositories.json`));
    if (!repositories.hasOwnProperty(request.params.id)) {
        // TODO: Make a "repository not found" template
        response.status(404).send('');
    }

    const body = request.body;

    const repository = repositories[request.params.id];
    const history = JSON.parse(fs.readFileSync(`data/repositories/${ repository.id }.json`));
    const typeValue = `repository-value-${repository.type}`;

    repository.description = body['repository-description'];
    repository.value = body[typeValue];
    repository.updated = Date.now();

    history.push(repository);

    repositories[repository.id] = repository;

    fs.writeFileSync(`data/repositories.json`, JSON.stringify(repositories, null, 4));
    fs.writeFileSync(`data/repositories/${ repository.id }.json`, JSON.stringify(history, null, 4));

    response.redirect(`/repositories/?saved`);
});

router.post('/add', bodyParser.urlencoded({ 'extended': false }), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    const repositories = JSON.parse(fs.readFileSync(`data/repositories.json`));
    const body = request.body;

    const typeValue = `repository-value-${body['repository-type']}`;
    const repository = {
        'id': body['repository-id'],
        'description': body['repository-description'],
        'type': body['repository-type'],
        'value': body[typeValue],
        'updated': Date.now()
    };

    if (typeof repositories[repository.id] !== 'undefined') {
        throw 'You cannot have two repositories with the same id';
    }
    repositories[repository.id] = repository;

    fs.writeFileSync(
        `data/repositories.json`,
        JSON.stringify(repositories, null, 4)
    );
    fs.writeFileSync(
        `data/repositories/${ repository.id }.json`,
        JSON.stringify([].push(repository), null, 4)
    );

    response.redirect(`/repositories/?saved`);
});

module.exports = router;
