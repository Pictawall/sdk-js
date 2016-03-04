'use strict';

const Model = require('ampersand-model');

const UserModel = Model.extend({

  idAttribute: 'id',
  props: {
    id: {
      type: 'number',
      required: true,
      setOnce: true
    },

    username: {
      type: 'string',
      required: true,
      setOnce: false
    },

    fullname: {
      type: 'string',
      required: true,
      setOnce: false
    },

    avatar: {
      type: 'string',
      required: true,
      setOnce: false
    },

    score: {
      type: 'number',
      required: true,
      setOnce: false
    }
  }
});

module.exports = UserModel;
