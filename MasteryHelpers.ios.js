'use strict';

var _ = require('underscore');

var ColorHelpers = require('./ColorHelpers.ios');

// From /webapp/stylesheets/shared-package/variables.less
var masteryColors = {
  unknown: '#dddddd',
  struggling: '#c30202',
  practiced: '#9cdceb',
  levelOne: '#58c4dd',
  levelTwo: '#29abca',
  mastered: '#1c758a',
};

/**
 * Given data about a particular math fact, determine the fact's mastery level
 *
 */
var masteryLevel = function(numTries, bestTime) {
  // TODO: Make this calculation take into account time and
  // recent stuff and stuff.

  // TODO: make this take an array of time data in the form:
  // [ {time: 1200, date: 19346832, hint: true},
  //   {time: 1000, date: 19346832, hint: false},
  //    ... ]

  return numTries > 3 ? masteryColors.mastered :
         numTries > 2 ? masteryColors.levelTwo :
         numTries > 1 ? masteryColors.levelOne :
         numTries > 0 ? masteryColors.practiced :
                        masteryColors.unknown;

};

var masteryColorText = function(masteryColor) {

  var masteryColorHSL = ColorHelpers.rgbToHsl(
      ColorHelpers.hexToRgb(masteryColor)
    );

  masteryColorHSL[2] *= 0.3;

  var masteryColorText = ColorHelpers.rgbToHex(
      ColorHelpers.hslToRgb(masteryColorHSL)
    );
  return masteryColorText;
};

module.exports = {
  masteryLevel: masteryLevel,
  masteryColorText: masteryColorText
};
