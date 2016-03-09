'use strict';

var MongoCursor = require('../../../../src/mixins/MongoQuery/MongoCursor');

describe('MongoCursor', function () {

  var DATA = [{ id: 3, name: 'Laetitia' }, { id: 4, name: 'Zzz' }, { id: 5, name: 'John' }, { id: 6, name: 'Fred' }, { id: 12, name: 'AAA' }];

  it('accepts MongoDB-like find queries', function () {
    var cursor = new MongoCursor({
      id: 5
    }, DATA);

    var result = cursor.toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].name).toBe('John');
  });

  it('accepts MongoDB-like sort queries', function () {
    var cursor = new MongoCursor({}, DATA);

    var result = cursor.sort({ name: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length);

    expect(result[0].name).toBe('Zzz');
  });

  it('accepts MongoDB-like limit queries', function () {
    var cursor = new MongoCursor({}, DATA);

    var result = cursor.limit(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(1);

    expect(result[0].id).toBe(DATA[0].id);
  });

  it('accepts MongoDB-like skip queries', function () {
    var cursor = new MongoCursor({}, DATA);

    var result = cursor.skip(1).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(DATA.length - 1);

    expect(result[0].id).toBe(DATA[1].id);
  });

  it('does not care when the sort query is called', function () {
    var cursor = new MongoCursor({}, DATA);

    var result = cursor.skip(2).limit(2).sort({ id: -1 }).toArray();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(2);

    expect(result[0].id).toBe(5);
    expect(result[1].id).toBe(4);
  });

  it('works with forEach', function () {
    var found = false;

    new MongoCursor({
      $or: [{ id: 5 }, { id: 6 }]
    }, DATA).limit(1).sort({ id: -1 }).forEach(function (item) {
      expect(item.id).toBe(6);
      found = true;
    });

    if (!found) {
      fail('Complex query failed to return any value.');
    }
  });

  it('accepts . separator in where queries', function () {

    var result = new MongoCursor({
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
    }]).toArray();

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(7);
  });

  it('accepts . separator in sort queries', function () {

    var result = new MongoCursor({}, [{
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
    }]).sort({ 'source.id': 1 }).toArray();

    expect(result.length).toBe(3);
    expect(result[0].source.id).toBe(1);
    expect(result[1].source.id).toBe(3);
    expect(result[2].source.id).toBe(7);
  });

  describe('$or selector', function () {
    it('accepts primitive values', function () {
      var result = new MongoCursor({
        id: { $or: [5, 6] }
      }, DATA).toArray();

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(5);
      expect(result[1].id).toBe(6);
    });

    it('accepts object values', function () {
      var result = new MongoCursor({
        $or: [{ id: 5 }, { id: 4 }]
      }, DATA).toArray();

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(4);
      expect(result[1].id).toBe(5);
    });
  });
});