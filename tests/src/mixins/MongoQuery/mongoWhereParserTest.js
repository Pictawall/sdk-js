'use strict';

const parseQuery = require('../../../../src/mixins/MongoQuery/mongoWhereParser');

describe('Finder selector', () => {

  beforeAll(() => {
    jasmine.addMatchers({
      /**
       * @memberOf jasmine.Matchers
       */
      toMatchItem: function () {
        return {
          compare: function (query, item) {
            const match = parseQuery(query);
            const pass = match(item);

            const message = `Expected query ${JSON.stringify(query)} to ${ pass ? 'NOT ' : '' }match item ${JSON.stringify(item)}`;

            return { pass, message };
          }
        };
      }
    });
  });

  describe('$eq', () => {
    it('is strict equality', () => {
      const query = { data: { $eq: 12 } };

      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: '12' });
    });

    it('is the default match selector', () => {
      const query = { data: 12 };

      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: '12' });
    });

    it('works with arrays', () => {
      const query = { data: [1, 2, 3] };

      expect(query).toMatchItem({ data: [1, 2, 3] });
      expect(query).not.toMatchItem({ data: [1, 2] });
      expect(query).not.toMatchItem({ data: 1 });
      expect(query).not.toMatchItem({ data: [3, 1, 2] });
    });

    it('works with objects', () => {
      expect({ network: { source: { id: 45 } } }).toMatchItem({ network: { source: { id: 45 } } });
    });
  });

  describe('$gt', () => {
    it('returns true if the item is greater than the selector value', () => {
      const query = { data: { $gt: 12 } };

      expect(query).not.toMatchItem({ data: 11 });
      expect(query).not.toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: 13 });
    });
  });

  describe('$gte', () => {
    it('returns true if the item is greater or equal to the selector value', () => {
      const query = { data: { $gte: 12 } };

      expect(query).not.toMatchItem({ data: 11 });
      expect(query).toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: 13 });
    });
  });

  describe('$lt', () => {
    it('returns true if the item is less than the selector value', () => {
      const query = { data: { $lt: 12 } };

      expect(query).toMatchItem({ data: 11 });
      expect(query).not.toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: 13 });
    });
  });

  describe('$lte', () => {
    it('returns true if the item is less than or equal to the selector value', () => {
      const query = { data: { $lte: 12 } };

      expect(query).toMatchItem({ data: 11 });
      expect(query).toMatchItem({ data: 12 });
      expect(query).not.toMatchItem({ data: 13 });
    });
  });

  describe('$ne', () => {
    it('is strict equality', () => {
      const query = { data: { $ne: 12 } };

      expect(query).not.toMatchItem({ data: 12 });
      expect(query).toMatchItem({ data: '12' });
    });

    it('works with arrays', () => {
      const query = { data: { $ne: [1, 2, 3] } };

      expect(query).not.toMatchItem({ data: [1, 2, 3] });
      expect(query).toMatchItem({ data: [1, 2] });
      expect(query).toMatchItem({ data: 1 });
      expect(query).toMatchItem({ data: [3, 1, 2] });
    });

    // TODO convert toBe to toMatchItem

    it('works with objects', () => {
      const match = parseQuery({ network: { source: { id: { $ne: 45 } } } });

      expect(match({ network: { source: { id: 45 } } })).toBe(false);
      expect(match({ network: { source: { id: 42 } } })).toBe(true);
    });
  });

  describe('$in', () => {
    it('returns true if the item is part of the array selector value', () => {
      const match = parseQuery({ data: { $in: [1, 2, 4] } });

      expect(match({ data: 1 })).toBe(true);
      expect(match({ data: 2 })).toBe(true);
      expect(match({ data: 3 })).toBe(false);
      expect(match({ data: 4 })).toBe(true);
      expect(match({ data: 5 })).toBe(false);
    });

    it('works with arrays', () => {
      const match = parseQuery({ data: { $in: [[1, 2, 3], [1], [2]] } });

      expect(match({ data: [1, 2, 3] })).toBe(true);
      expect(match({ data: [1] })).toBe(true);
      expect(match({ data: [2] })).toBe(true);
      expect(match({ data: [3, 2, 1] })).toBe(false);
      expect(match({ data: 1 })).toBe(false);
    });
  });

  describe('$nin', () => {
    it('returns false if the item is part of the array selector value', () => {
      const match = parseQuery({ data: { $nin: [1, 2, 4] } });

      expect(match({ data: 1 })).toBe(false);
      expect(match({ data: 2 })).toBe(false);
      expect(match({ data: 3 })).toBe(true);
      expect(match({ data: 4 })).toBe(false);
      expect(match({ data: 5 })).toBe(true);
    });

    it('works with arrays', () => {
      const match = parseQuery({ data: { $nin: [[1, 2, 3], [1], [2]] } });

      expect(match({ data: [1, 2, 3] })).toBe(false);
      expect(match({ data: [1] })).toBe(false);
      expect(match({ data: [2] })).toBe(false);
      expect(match({ data: [3, 2, 1] })).toBe(true);
      expect(match({ data: 1 })).toBe(true);
    });
  });

  describe('$or', () => {
    it('accepts an array of primitives', () => {
      const match = parseQuery({ id: { $or: [5, 6] } });

      expect(match({ id: 6, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 5, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 4, dummyData: 'blah' })).toBe(false);
      expect(match({ dummyData: 'blah' })).toBe(false);
    });

    it('accepts an array of objects', () => {
      const match = parseQuery({ $or: [{ id: 2 }, { id: 42 }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 128, dummyData: 'blah' })).toBe(false);
      expect(match({ dummyData: 'blah' })).toBe(false);
    });

    it('denies non-arrays', () => {
      const match = parseQuery({ id: { $or: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {
      }
    });
  });

  describe('$nor', () => {
    it('accepts an array of primitives', () => {
      const match = parseQuery({ id: { $nor: [5, 6] } });

      expect(match({ id: 6, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 5, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 4, dummyData: 'blah' })).toBe(true);
      expect(match({ dummyData: 'blah' })).toBe(true);
    });

    it('accepts an array of objects', () => {
      const match = parseQuery({ $nor: [{ id: 2 }, { id: 42 }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 128, dummyData: 'blah' })).toBe(true);
      expect(match({ dummyData: 'blah' })).toBe(true);
    });

    it('denies non-arrays', () => {
      const match = parseQuery({ id: { $nor: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {
      }
    });
  });

  describe('$and', () => {
    it('accepts an array of objects', () => {
      const match = parseQuery({ $and: [{ id: 2 }, { dummyData: 'blah' }] });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 2, dummyData: 'meh' })).toBe(false);
    });

    it('is the default boolean selector', () => {
      const selector = { id: 2, dummyData: 'blah' };

      expect(selector).toMatchItem({ id: 2, dummyData: 'blah' });
      expect(selector).not.toMatchItem({ id: 42, dummyData: 'blah' });
      expect(selector).not.toMatchItem({ id: 2, dummyData: 'meh' });
    });

    it('denies non-arrays', () => {
      const match = parseQuery({ id: { $and: 2 } });

      try {
        match({ id: 2, dummyData: 'blah' });
        fail('Expected match to throw');
      } catch (e) {
      }
    });
  });

  describe('$not', () => {

    it('inverts the results of its parameter', () => {
      const match = parseQuery({ id: { $not: 2 } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(false);
    });

    it('can be top level', () => {
      const match = parseQuery({ $not: { id: 2 } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(false);
    });

    it('accepts any query', () => {
      const match = parseQuery({ $not: { $and: [{ id: 2 }, { dummyData: 'blah' }] } });

      expect(match({ id: 2, dummyData: 'blah' })).toBe(false);
      expect(match({ id: 42, dummyData: 'blah' })).toBe(true);
      expect(match({ id: 2 })).toBe(true);
    });
  });

  describe('unknown', () => {
    it('throws', () => {
      const match = parseQuery({ data: { $unknown: [1, 2, 4] } });

      try {
        match({ data: 1 });
        fail('Query should have thrown');
      } catch (e) {
      }
    });
  });
});
