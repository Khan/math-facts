'use strict';

var randomIntBetween = function(min, max) {
  return Math.floor(Math.random()*(max - min + 1)) + min;
};

module.exports = {
  randomIntBetween: randomIntBetween,
};
