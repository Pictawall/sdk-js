'use strict';

module.exports = {
  assertModelLoaded: function assertModelLoaded(model, properties) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;

    var _iteratorError = void 0;

    try {
      for (var _iterator = Object.getOwnPropertyNames(properties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var propertyName = _step.value;

        expect(model.getProperty(propertyName)).toEqual(properties[propertyName]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
};