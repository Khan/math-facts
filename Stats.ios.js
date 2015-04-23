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

var Stats = React.createClass({
  render: function() {

    var colorHue = 0;
    var gridCell = (content, style) => {
      var rgb = hslToRgb(colorHue += 0.1, 0.7, 0.7);
      var rgbString = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
      return (
        <View style={[style, {backgroundColor: rgbString}]}>
          <Text>
            {content}
          </Text>
        </View>
      );
    };

    var grid = [
    <View style={styles.gridRow}>
      {gridCell("+", styles.gridCell)}
      {_.map(_.range(1, 11), (col) => {
            return (gridCell(col, styles.gridCell));
          })}
    </View>,
    _.map(_.range(1, 11), (row) => {
      return (
        <View style={styles.gridRow}>
          {gridCell(row, styles.gridCell)}
          {_.map(_.range(1, 11), (col) => {
            return (gridCell(row + col, styles.gridCell));
          })}
        </View>
      );
    })];

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.back}>
          <Text>Back</Text>
        </TouchableHighlight>
        <View style={styles.grid}>

          {grid}
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    justifyContent: 'center'
  },
  grid: {
    backgroundColor: "#eee",
    flex: 0
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
  },
  gridCell: {
    flex: 1,
    height: 25,
    width: 25,
    backgroundColor: "#face01",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  gridCellText: {

  }
});

module.exports = Stats;