'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fsp = require('fs-promise');
const getJson = require('../../helpers/get-json');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (request, response) => {
    fsp.readFile('data/shards.json')
        .then((data) => {
            response.json(getJson(data));
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.get('/:id', (request, response) => {
    fsp.readFile('data/shards.json')
        .then((data) => {
            const shards = getJson(data);
            const shard = shards[request.params.id];

            if (typeof shard === 'undefined') {
                // TODO: Make a "shard not found" template
                response.status(404).send('');
                return;
            }

            response.json(shard);
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.delete('/:id', (request, response) => {
    let shards;
    const deleteId = request.params.id;

    fsp.readFile('data/shards.json')
        .then((data) => {
            shards = getJson(data);

            const shard = shards[deleteId];
            if (typeof shard === 'undefined') {
                // TODO: Make a "shard not found" template
                response.status(404).send('');

                // TODO: Figure out how this will work with the promise-based logic now
                return Promise.reject();
            }

            delete shards[deleteId];
            const deletePromise = fsp.unlink(`data/shards/${ shard.id }.json`);
            const shardPromise = fsp.writeFile('data/shards.json', JSON.stringify(shards, null, 4));

            return Promise.all([deletePromise, shardPromise]);
        })
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => {
            console.dir(error);
            response.status(500).end();
        });
});

router.get('/history/:id', (request, response) => {
    fsp.readFile(`data/shards/${ request.params.id }.json`)
        .then((data) => {
            response.json(getJson(data));
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

        let shards, history;
        const shard = request.body;
        if (typeof shard.updated === 'undefined') {
            shard.updated = Date.now();
        }

        fsp.readFile('data/shards.json')
            .then((data) => {
                shards = getJson(data);

                if (typeof shards[shard.id] === 'undefined') {
                    return Promise.resolve(JSON.stringify([]));
                } else {
                    return fsp.readFile(`data/shards/${ shard.id }.json`);
                }
            })
            .then((data) => {
                history = getJson(data);

                history.push({
                    'value': shard.value,
                    'updated': shard.updated
                });

                shards[shard.id] = shard;

                const shardPromise = fsp.writeFile('data/shards.json', JSON.stringify(shards, null, 4));
                const historyPromise = fsp.writeFile(`data/shards/${ shard.id }.json`, JSON.stringify(history, null, 4));

                return Promise.all([shardPromise, historyPromise]);
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
        'data/shards.json'
    ],
    'dataDirs': [
        'data/shards'
    ]
};
