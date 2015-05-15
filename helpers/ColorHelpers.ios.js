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

// From /webapp/stylesheets/shared-package/variables.less

var KAColors = {
  mathDomainColor: '#1c758a',
  mathSubjectColor: '#46a8bf',
  mathTopicColor: '#4fbad4',
  blueDark: '#2c3747',
  blueDarkUnsaturated: '#3b414e',
  blueDarkSaturated: '#1f3043',
  blue: '#005a88',
  blueLight: '#a9c0d1',
  green: '#76a005',
  greenLight: '#c6d1ad',
  greenDark: '#356700',
  yellowGreen: '#9db63b',
  okGreen: '#a7cf5b',
  orange: '#bf4f04',
  red: '#cf5044',
};

var masteryColors = {
  unknown: '#eeeeee',
  struggling: '#c30202',
  practiced: '#9cdceb',
  levelOne: '#58c4dd',
  levelTwo: '#29abca',
  mastered: KAColors.mathDomainColor,
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
var hslToRgb = function(hsl) {
  var h = hsl[0];
  var s = hsl[1];
  var l = hsl[2];
  var r, g, b;

  // Allow h to roll over
  h = h % 1;

  if (s == 0){
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * From: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
var rgbToHsl = function(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h, s, l];
};

var printRgb = function(rgb) {
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

var printHsl = function(hsl) {
  return 'hsl(' + hsl[0] + ',' + hsl[1] + ',' + hsl[2] + ')';
};

// From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
}

// From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

module.exports = {
  hslToRgb: hslToRgb,
  rgbToHsl: rgbToHsl,
  printRgb: printRgb,
  printHsl: printHsl,
  hexToRgb: hexToRgb,
  rgbToHex: rgbToHex,
};
