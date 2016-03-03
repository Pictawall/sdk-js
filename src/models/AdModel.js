'use strict';

const CardModel = require('./CardModel');

const AdModel = CardModel.extend({

  props: {
    /*
     displayOrder: # (optionnal) TODO unknown
     embed: # (boolean) TODO unknown
     */
  }
});

module.exports = AdModel;
