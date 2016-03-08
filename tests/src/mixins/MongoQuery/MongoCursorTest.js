'use strict';

const MongoCursor = require('../../../../src/mixins/MongoQuery/MongoCursor');

describe('MongoCursor', () => {

  const DATA = [
    { id: 3, name: 'Laetitia' },
    { id: 4, name: 'Zzz' },
    { id: 5, name: 'John' },
    { id: 6, name: 'Fred' },
    { id: 12, name: 'AAA' }
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

  it('accepts MongoDB-like limit queries', () => {
    const cursor = new MongoCursor({}, DATA);

    const result = cursor.limit(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].id).toBe(DATA[0].id);
  });

  it('accepts MongoDB-like skip queries', () => {
    const cursor = new MongoCursor({}, DATA);

    const result = cursor.skip(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length - 1);

    expect(result[0].id).toBe(DATA[1].id);
  });

  it('accepts all of the above at the same time', () => {
    const cursor = new MongoCursor({}, DATA);

    const result = cursor.skip(2).limit(2).sort({ id: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(2);

    expect(result[0].id).toBe(5);
    expect(result[1].id).toBe(4);
  });

  it('works with deeper queries', () => {
    (new MongoCursor(DATA, {
      id: { $not: { $lte: 5, $gte: 7 } }
    })).sort({ id: -1 }).limit(1).skip(1).forEach(item => {
      console.log(item.id);
    });
  });
});
