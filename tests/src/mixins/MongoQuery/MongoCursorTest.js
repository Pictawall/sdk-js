'use strict';

const MongoCursor = require('../../../../src/mixins/MongoQuery/MongoCursor');

describe('MongoCursor', () => {

  it('accepts MongoDB-like queries', () => {
    const cursor = new MongoCursor({
      id: 5
    }, [
      { id: 4, name: 'Laetitia' },
      { id: 5, name: 'John' },
      { id: 6, name: 'Fred' }
    ]);

    const result = cursor.toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].name).toBe('John');
  });
});
