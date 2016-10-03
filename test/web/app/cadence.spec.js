/* global define */
'use strict';

define(['cadence'], (Cadence) => {
    let app;

    describe('Cadence App', () => {
        beforeEach(() => {
            app = new Cadence();
            app.start();
        });

        xit('does not have any tests', () => {});
    });
});
