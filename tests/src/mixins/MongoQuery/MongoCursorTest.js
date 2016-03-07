'use strict';

const MongoCursor = require('../../../../src/mixins/MongoQuery/MongoCursor');

describe('MongoCursor', () => {

  const DATA = [
    { id: 3, name: 'Laetitia' },
    { id: 4, name: 'Zzz' },
    { id: 5, name: 'John' },
    { id: 6, name: 'Fred' },
    { id: 12, name: 'AAA'}
  ];

  it('accepts MongoDB-like find queries', () => {
    const cursor = new MongoCursor({
      id: 5
    }, DATA);

    const result = cursor.toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].name).toBe('John');
  });

  it('accepts MongoDB-like sort queries', () => {
    const cursor = new MongoCursor({}, DATA);

    const result = cursor.sort({ name: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length);

    expect(result[0].name).toBe('Zzz');
  });
});
