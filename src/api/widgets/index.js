'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fsp = require('fs-promise');
const getJson = require('../../helpers/get-json');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    fsp.readFile('data/widgets.json')
        .then((data) => {
            response.json(getJson(data));
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.get('/:id', (request, response) => {
    fsp.readFile('data/widgets.json')
        .then((data) => {
            const widgets = getJson(data);
            const widget = widgets[request.params.id];

            if (typeof widget === 'undefined') {
                // TODO: Make a "widget not found" template
                response.status(404).send('');
                return;
            }

            response.json(widget);
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.delete('/:id', (request, response) => {
    let widgets;
    const deleteId = request.params.id;

    fsp.readFile('data/widgets.json')
        .then((data) => {
            widgets = getJson(data);

            const widget = widgets[deleteId];
            if (typeof widget === 'undefined') {
                // TODO: Make a "widget not found" template
                response.status(404).send('');

                // TODO: Figure out how this will work with the promise-based logic now
                return Promise.reject();
            }

            delete widgets[deleteId];
            return fsp.writeFile('data/widgets.json', JSON.stringify(widgets, null, 4));
        })
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.put(
    '/:id',
    bodyParser.json(),
    (request, response) => {
        if (!request.body) {
            // TODO: error message
            return response.status(400).end();
        }

        let widgets;
        const widget = request.body;
        if (typeof widget.updated === 'undefined') {
            widget.updated = Date.now();
        }

        fsp.readFile('data/widgets.json')
            .then((data) => {
                widgets = getJson(data);
                widgets[widget.id] = widget;

                return fsp.writeFile('data/widgets.json', JSON.stringify(widgets, null, 4));
            })
            .then(() => {
                response.status(204).end();
            })
            .catch((error) => {
                console.dir(error);
                response.status(500).end();
            });
    }
);

module.exports = {
    'router': router,
    'dataFiles': [
        'data/widgets.json'
    ],
    'dataDirs': [
        'data/widgets'
    ]
};
