import { assert } from 'chai';
import query from './query';
import { LUIS_API_ROOT } from '../../config';

describe('api/luis/query.ts', () => {
    it('Come back with the correct fields', () => {
        return query(LUIS_API_ROOT, 'corgi').then((data) => {
            assert.isObject(data, 'data must be an object');
            assert.propertyVal(data, 'query', 'corgi');
            assert.property(data, 'intents');
            assert.property(data, 'entities');
        });
    });

    it('Have a null query field', () => {
        return query(LUIS_API_ROOT, '').then((data) => {
            assert.propertyVal(data, 'query', null);
        });
    });
});
