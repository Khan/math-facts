'use strict';

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
const hslToRgb = function(hsl) {
  const h = hsl[0] % 1; // Allow h to roll over
  const s = hsl[1];
  const l = hsl[2];
  let r, g, b;

  if (s == 0){
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
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
 * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
const rgbToHsl = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
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

const printRgb = function(rgb) {
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

const printHsl = function(hsl) {
  return 'hsl(' + hsl[0] + ',' + hsl[1] + ',' + hsl[2] + ')';
};

// From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
};

// From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(rgb) {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const backgroundColors = [
  hslToRgb([0.35, 0.39, 0.46]), // green
  hslToRgb([0.41, 0.69, 0.38]), // green-teal
  hslToRgb([0.46, 1.00, 0.33]), // teal
  hslToRgb([0.50, 0.87, 0.34]), // teal-blue
  hslToRgb([0.54, 0.68, 0.46]), // blue
  hslToRgb([0.63, 0.63, 0.67]), // blue-purple
  hslToRgb([0.70, 0.75, 0.72]), // purple
  hslToRgb([0.80, 0.58, 0.64]), // purple-pink
  hslToRgb([0.90, 0.57, 0.63]), // pink
  hslToRgb([0.95, 0.58, 0.64]), // pink-red
  hslToRgb([0.00, 0.84, 0.66]), // red
  hslToRgb([0.03, 0.72, 0.61]), // red-orange
  hslToRgb([0.06, 0.69, 0.55]), // orange
  hslToRgb([0.08, 0.56, 0.51]), // orange-yellow
  hslToRgb([0.10, 0.68, 0.45]), // yellow
  hslToRgb([0.20, 0.73, 0.35]), // light green
  hslToRgb([0.30, 0.55, 0.42]), // light green-green
];

module.exports = {
  backgroundColors: backgroundColors,
  hslToRgb: hslToRgb,
  rgbToHsl: rgbToHsl,
  printRgb: printRgb,
  printHsl: printHsl,
  hexToRgb: hexToRgb,
  rgbToHex: rgbToHex,
};
