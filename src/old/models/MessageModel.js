'use strict';

const Model = require('ampersand-model');

/**
 * @class MessageModel
 */
const MessageModel = Model.extend({

  /*
   url: # (string|null) TODO unknown
   position: # (number) TODO unknown
   */

  idAttribute: 'id',

  props: {

    id: {
      type: 'number',
      required: true,
      setOnce: true
    },

    title: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      required: true
    },

    duration: {
      type: 'number',
      required: true
    },

    play: {
      type: 'boolean',
      required: true
    },

    startTime: {
      type: 'number',
      required: true
    },

    endTime: {
      type: 'number',
      required: true
    }
  }
});

module.exports = MessageModel;
