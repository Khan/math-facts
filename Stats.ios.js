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
  propTypes: {

  },
  getInitialState: function() {
    return {
      quizzesData: this.getInitialQuizzesData()
    };
  },
  getInitialQuizzesData: function() {
    // Size must be larger than the max size of the values that are added
    return _.map(_.range(0, 12), () => {
      return _.map(_.range(0, 12), () => { return 0 });
    });
  },
  componentWillReceiveProps: function(newProps) {
    var quizzesData = this.getInitialQuizzesData();

    _.each(newProps.quizzesData, (obj, index) => {
      var id = obj._id;
      var quizData = obj.quizData;
      _.each(quizData, (data) => {
        quizzesData[data.left][data.right]++;
      });
    });

    this.setState({
      quizzesData: quizzesData
    });
  },
  render: function() {

    var gridCell = (content, color, key) => {
      color = color.length ? color : '#ddd';
      return (
        <View
            key={key}
            style={[styles.gridCell, {backgroundColor: color}]}>
          <Text>
            {content}
          </Text>
        </View>
      );
    };

    var grid = (
      <View style={styles.grid}>
        <View
            style={styles.gridRow}
            key={'header-row'}>
          {gridCell('+', '#ccc', 'cell-sign')}
          {_.map(_.range(0, 10), (col) => {
            return (gridCell(col + 1, '#ddd', 'cell-col-header-' + col));
          })}
        </View>
        {_.map(_.range(0, 10), (row) => {
          return (
              <View style={styles.gridRow} key={'row-' + row}>
                {gridCell(row + 1, '#eee', 'cell-row-header-' + row)}
                {_.map(_.range(0, 10), (col) => {
                  var numTries = this.state.quizzesData[row][col];;
                  var rgb = hslToRgb(0.25, 0.7, 1 - Math.min(numTries/10, 0.8));
                  return (gridCell(row + 1 + col + 1,
                    'rgb(' + rgb[0] +', ' + rgb[1] +', ' + rgb[2] +')',
                    'cell-' + row + '-' + col));
                })}
              </View>
          );
        })}
      </View>
    );

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.back}>
          <Text>Back</Text>
        </TouchableHighlight>

        {grid}
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
    backgroundColor: '#eee',
    flex: 0
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    height: 25,
    width: 25,
    backgroundColor: '#face01',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridCellText: {

  }
});

module.exports = Stats;