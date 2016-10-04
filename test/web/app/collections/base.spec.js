/* global define */
'use strict';

define(['collections/base'], (BaseCollection) => {
    describe('BaseCollection', () => {
        let collection;

        beforeEach(() => {
            collection = new BaseCollection();
        });

        describe('parse', () => {
            it('sets the "id" property on models before returning the response', () => {
                const response = {
                    'key1': {
                        'prop1': 'val1',
                        'prop2': 'val2'
                    },
                    'key2': {
                        'prop3': 'val3',
                        'prop4': 'val4'
                    },
                    'key3': {
                        'prop5': 'val5',
                        'prop6': 'val6'
                    }
                };
                const result = [
                    {
                        'id': 'key1',
                        'prop1': 'val1',
                        'prop2': 'val2'
                    },
                    {
                        'id': 'key2',
                        'prop3': 'val3',
                        'prop4': 'val4'
                    },
                    {
                        'id': 'key3',
                        'prop5': 'val5',
                        'prop6': 'val6'
                    }
                ];

                expect(collection.parse(response)).to.eql(result);
            });
        });
    });
});
