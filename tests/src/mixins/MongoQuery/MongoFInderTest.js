'use strict';

const MongoFinder = require('../../../../src/mixins/MongoQuery/MongoFinder');

describe('MongoFinder', () => {

  const DATA = [
    { id: 3, name: 'Laetitia' },
    { id: 4, name: 'Zzz' },
    { id: 5, name: 'John' },
    { id: 6, name: 'Fred' },
    { id: 12, name: 'AAA' }
  ];

  it('accepts MongoDB-like find queries', () => {
    const cursor = new MongoFinder({
      id: 5
    }, DATA);

    const result = cursor.toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].name).toBe('John');
  });

  it('accepts MongoDB-like sort queries', () => {
    const cursor = new MongoFinder({}, DATA);

    const result = cursor.sort({ name: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length);

    expect(result[0].name).toBe('Zzz');
  });

  it('accepts MongoDB-like limit queries', () => {
    const cursor = new MongoFinder({}, DATA);

    const result = cursor.limit(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].id).toBe(DATA[0].id);
  });

  it('accepts MongoDB-like skip queries', () => {
    const cursor = new MongoFinder({}, DATA);

    const result = cursor.skip(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length - 1);

    expect(result[0].id).toBe(DATA[1].id);
  });

  it('does not care when the sort query is called', () => {
    const cursor = new MongoFinder({}, DATA);

    const result = cursor.skip(2).limit(2).sort({ id: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(2);

    expect(result[0].id).toBe(5);
    expect(result[1].id).toBe(4);
  });

  it('works with forEach', () => {
    let found = false;

    (new MongoFinder({
      $or: [{ id: 5 }, { id: 6 }]
    }, DATA)).limit(1).sort({ id: -1 }).forEach(item => {
      expect(item.id).toBe(6);
      found = true;
    });

    if (!found) {
      fail('Complex query failed to return any value.');
    }
  });

  it('accepts . separator in where queries', () => {

    const result = (new MongoFinder({
      'source.id': 1
    }, [{
      id: 1,
      source: {
        network: 'twitter',
        id: 7
      }
    }, {
      id: 7,
      source: {
        network: 'facebook',
        id: 1
      }
    }])).toArray();

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(7);
  });

  it('accepts . separator in sort queries', () => {

    const result = (new MongoFinder({}, [{
      id: 1,
      source: {
        network: 'twitter',
        id: 7
      }
    }, {
      id: 7,
      source: {
        network: 'facebook',
        id: 1
      }
    }, {
      id: 19,
      source: {
        network: 'facebook',
        id: 3
      }
    }])).sort({ 'source.id': 1 }).toArray();

    expect(result.length).toBe(3);
    expect(result[0].source.id).toBe(1);
    expect(result[1].source.id).toBe(3);
    expect(result[2].source.id).toBe(7);
  });
});
