'use strict';

var parseQuery = require('../../../../src/mixins/MongoQuery/mongoWhereParser');

describe('Finder selector', function () {

  beforeAll(function () {
    jasmine.addMatchers({
      /**
       * @memberOf jasmine.Matchers
       */
      toMatchItem: function toMatchItem() {
        return {
          compare: function compare(query, item) {
            var match = parseQuery(query);
            var pass = match(item);

            var message = 'Expected query ' + JSON.stringify(query) + ' to ' + (pass ? 'NOT ' : '') + 'match item ' + JSON.stringify(item);

            return { pass: pass, message: message };
          }
        };
      }
    });
  });

  describe('$eq', function () {
    it('is strict equality', function () {
      var query = { data: { $eq: 12 } };

      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: '12' });
    });

    it('is the default match selector', function () {
      var query = { data: 12 };

      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: '12' });
    });

    it('works with arrays', function () {
      var query = { data: [1, 2, 3] };

      expect(query).toMatchItem({ data: [1, 2, 3] });
      expect(query).not.toMatchItem({ data: [1, 2] });
      expect(query).not.toMatchItem({ data: 1 });
      expect(query).not.toMatchItem({ data: [3, 1, 2] });
    });

    it('works with objects', function () {
      expect({ network: { source: { id: 45 } } }).toMatchItem({ network: { source: { id: 45 } } });
    });
  });

  describe('$gt', function () {
    it('returns true if the item is greater than the selector value', function () {
      var query = { data: { $gt: 12 } };

      expect(query).not.toMatchItem({ data: 11 });
      expect(query).not.toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: 13 });
    });
  });

  describe('$gte', function () {
    it('returns true if the item is greater or equal to the selector value', function () {
      var query = { data: { $gte: 12 } };

      expect(query).not.toMatchItem({ data: 11 });
      expect(query).toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: 13 });
    });
  });

  describe('$lt', function () {
    it('returns true if the item is less than the selector value', function () {
      var query = { data: { $lt: 12 } };

      expect(query).toMatchItem({ data: 11 });
      expect(query).not.toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: 13 });
    });
  });

  describe('$lte', function () {
    it('returns true if the item is less than or equal to the selector value', function () {
      var query = { data: { $lte: 12 } };

      expect(query).toMatchItem({ data: 11 });
      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: 13 });
    });
  });

  describe('$ne', function () {
    it('is strict equality', function () {
      var query = { data: { $ne: 12 } };

      expect(query).not.toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: '12' });
    });

    it('works with arrays', function () {
      var query = { data: { $ne: [1, 2, 3] } };

      expect(query).not.toMatchItem({ data: [1, 2, 3] });
      expect(query).toMatchItem({ data: [1, 2] });
      expect(query).toMatchItem({ data: 1 });
      expect(query).toMatchItem({ data: [3, 1, 2] });
    });

    // TODO convert toBe to toMatchItem

    it('works with objects', function () {
      var match = parseQuery({ network: { source: { id: { $ne: 45 } } } });

      expect(match({ network: { source: { id: 45 } } })).toBe(false);
      expect(match({ network: { source: { id: 42 } } })).toBe(true);
    });
  });

  describe('$in', function () {
    it('returns true if the item is part of the array selector value', function () {
      var match = parseQuery({ data: { $in: [1, 2, 4] } });

      expect(match({ data: 1 })).toBe(true);
      expect(match({ data: 2 })).toBe(true);
      expect(match({ data: 3 })).toBe(false);
      expect(match({ data: 4 })).toBe(true);
      expect(match({ data: 5 })).toBe(false);
    });

    it('works with arrays', function () {
      var match = parseQuery({ data: { $in: [[1, 2, 3], [1], [2]] } });

      expect(match({ data: [1, 2, 3] })).toBe(true);
      expect(match({ data: [1] })).toBe(true);
      expect(match({ data: [2] })).toBe(true);
      expect(match({ data: [3, 2, 1] })).toBe(false);
      expect(match({ data: 1 })).toBe(false);
    });
  });

  describe('$nin', function () {
    it('returns false if the item is part of the array selector value', function () {
      var match = parseQuery({ data: { $nin: [1, 2, 4] } });

      expect(match({ data: 1 })).toBe(false);
      expect(match({ data: 2 })).toBe(false);
      expect(match({ data: 3 })).toBe(true);
      expect(match({ data: 4 })).toBe(false);
      expect(match({ data: 5 })).toBe(true);
    });

    it('works with arrays', function () {
      var match = parseQuery({ data: { $nin: [[1, 2, 3], [1], [2]] } });

      expect(match({ data: [1, 2, 3] })).toBe(false);
      expect(match({ data: [1] })).toBe(false);
      expect(match({ data: [2] })).toBe(false);
      expect(match({ data: [3, 2, 1] })).toBe(true);
      expect(match({ data: 1 })).toBe(true);
    });
  });

  describe('$or', function () {
    it('accepts an array of primitives', function () {
      var match = parseQuery({ id: { $or: [5, 6] } });

      expect(match({ id: 6, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 5, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 4, dummyData: 'blah' })).toBe(false);
      expect(match({ dummyData: 'blah' })).toBe(false);
    });

    it('accepts an array of objects', function () {
      var match = parseQuery({ $or: [{ id: 2 }, { id: 42 }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 128, dummyData: 'blah' })).toBe(false);
      expect(match({ dummyData: 'blah' })).toBe(false);
    });

    it('denies non-arrays', function () {
      var match = parseQuery({ id: { $or: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {}
    });
  });

  describe('$nor', function () {
    it('accepts an array of primitives', function () {
      var match = parseQuery({ id: { $nor: [5, 6] } });

      expect(match({ id: 6, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 5, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 4, dummyData: 'blah' })).toBe(true);
      expect(match({ dummyData: 'blah' })).toBe(true);
    });

    it('accepts an array of objects', function () {
      var match = parseQuery({ $nor: [{ id: 2 }, { id: 42 }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 128, dummyData: 'blah' })).toBe(true);
      expect(match({ dummyData: 'blah' })).toBe(true);
    });

    it('denies non-arrays', function () {
      var match = parseQuery({ id: { $nor: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {}
    });
  });

  describe('$and', function () {
    it('accepts an array of objects', function () {
      var match = parseQuery({ $and: [{ id: 2 }, { dummyData: 'blah' }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 2, dummyData: 'meh' })).toBe(false);
    });

    it('is the default boolean selector', function () {
      var selector = { id: 2, dummyData: 'blah' };

      expect(selector).toMatchItem({ id: 2, dummyData: 'blah' });
      expect(selector).not.toMatchItem({ id: 42, dummyData: 'blah' });
      expect(selector).not.toMatchItem({ id: 2, dummyData: 'meh' });
    });

    it('denies non-arrays', function () {
      var match = parseQuery({ id: { $and: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {}
    });
  });

  describe('$not', function () {

    it('inverts the results of its parameter', function () {
      var match = parseQuery({ id: { $not: 2 } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(false);
    });

    it('can be top level', function () {
      var match = parseQuery({ $not: { id: 2 } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(false);
    });

    it('accepts any query', function () {
      var match = parseQuery({ $not: { $and: [{ id: 2 }, { dummyData: 'blah' }] } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(true);
    });
  });

  describe('unknown', function () {
    it('throws', function () {
      var match = parseQuery({ data: { $unknown: [1, 2, 4] } });

      try {
        match({ data: 1 });
        fail('Query should have thrown');
      } catch (e) {}
    });
  });
});