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

var hslToRgb = require('./Helpers.ios').hslToRgb;

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