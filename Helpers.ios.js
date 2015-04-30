'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

var randomIntBetween = function(min, max) {
  return Math.floor(Math.random()*(max - min + 1)) + min;
};



/**
 * Given data about a particular math fact, determine the fact's mastery level
 *
 */
var masteryLevel = function() {
  // TODO: ...this.

};

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
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * From: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    // Allow h to roll over
    h = h % 1;

    if (s == 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = {
	randomIntBetween: randomIntBetween,
	hslToRgb: hslToRgb
};