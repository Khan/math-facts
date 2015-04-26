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
      attemptData: this.getInitialQuizzesData(),
      timeData: this.getInitialQuizzesData(),
      active: [1, 2]
    };
  },
  getInitialQuizzesData: function() {
    // Size must be larger than the max size of the values that are added
    return _.map(_.range(0, 12), () => {
      return _.map(_.range(0, 12), () => { return 0 });
    });
  },
  componentWillReceiveProps: function(newProps) {
    var attemptData = this.getInitialQuizzesData();
    var timeData = this.getInitialQuizzesData();

    _.each(newProps.quizzesData, (obj, index) => {
      var id = obj._id;
      var quizData = obj.quizData;
      _.each(quizData, (data) => {
        attemptData[data.left][data.right]++;

        var time = timeData[data.left][data.right];
        timeData[data.left][data.right] = time > 0 ?
          Math.min(time, data.time) : data.time;
      });
    });

    this.setState({
      attemptData: attemptData,
      timeData: timeData
    });
  },
  render: function() {

    var gridCell = (content, color, key, onPress) => {
      onPress = onPress || null;
      color = color.length ? color : '#ddd';
      if (onPress) {
        return (
          <TouchableHighlight
              key={key}
              style={[styles.gridCell, {backgroundColor: color}]}
              underlayColor="transparent"
              onPress={onPress}>
            <Text style={styles.gridCellText}>
              {content}
            </Text>
          </TouchableHighlight>
        );
      } else {
        return (
          <View
              key={key}
              style={[styles.gridCell, {backgroundColor: color}]}>
            <Text style={styles.gridCellText}>
              {content}
            </Text>
          </View>
        );
      }
    };

    var grid = (
      <View style={styles.grid}>
        <View
            style={styles.gridRow}
            key={'header-row'}>
          {gridCell('+', '#ddd', 'cell-sign')}
          {_.map(_.range(0, 10), (col) => {
            return (gridCell(col + 1, '#eee', 'cell-col-header-' + col));
          })}
        </View>
        {_.map(_.range(0, 10), (row) => {
          return (
              <View style={styles.gridRow} key={'row-' + row}>
                {gridCell(row + 1, '#eee', 'cell-row-header-' + row)}
                {_.map(_.range(0, 10), (col) => {
                  var numTries = this.state.attemptData[row + 1][col + 1];
                  var colors = [
                    hslToRgb(0, 0.7, 0.6), // red
                    hslToRgb(0.06, 0.7, 0.6), // orange
                    hslToRgb(0.1, 0.75, 0.58), // yellow
                    hslToRgb(0.2, 0.5, 0.5), // light green
                    hslToRgb(0.35, 0.4, 0.55), // green
                    hslToRgb(0.45, 0.6, 0.5), // teal
                    hslToRgb(0.55, 0.5, 0.5), // blue
                    hslToRgb(0.7, 0.6, 0.65), // purple
                    hslToRgb(0.8, 0.6, 0.65), // purple-pink
                    hslToRgb(0.9, 0.6, 0.65), // pink
                  ];
                  // TODO: Make this calculation take into account time and
                  // recent stuff and stuff.
                  var index = numTries > 5 ? 4 :
                              numTries > 2 ? 3 :
                              numTries > 1 ? 2 :
                              numTries > 0 ? 1 : 0;

                  var rgb = colors[index];

                  return (gridCell(row + 1 + col + 1,
                    'rgb(' + rgb[0] +', ' + rgb[1] +', ' + rgb[2] +')',
                    'cell-' + row + '-' + col,
                    () => {
                      this.setState({
                        active: [row + 1, col + 1]
                      });
                    }));
                })}
              </View>
          );
        })}
      </View>
    );

    var activeRow = this.state.active[0];
    var activeCol = this.state.active[1];
    var timesAnswered = this.state.attemptData[activeRow][activeCol];
    var bestTime = this.state.timeData[activeRow][activeCol]/1000;

    var info = (<View style={styles.infoContainer}>
      <Text style={styles.infoQuestion}>
        {activeRow + ' + ' + activeCol + ' = ' + (activeRow + activeCol)}
      </Text>
      <Text style={styles.infoStat}>
        {'Times Answered: ' + timesAnswered}
      </Text>
      {(timesAnswered && bestTime) ?
        <Text style={styles.infoStat}>
          {'Best Time: ' + bestTime + 's'}
        </Text>
      : null}
    </View>);

    return (
      <View style={styles.container}>
        <TouchableHighlight
            onPress={this.props.back}
            style={styles.backButton}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableHighlight>
        {grid}
        {info}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    justifyContent: 'flex-start'
  },

  backButton: {
    alignSelf: 'flex-start',
    padding: 15
  },
  backButtonText: {
  },

  infoContainer: {
    alignItems: 'center',
    margin: 20
  },
  infoQuestion: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 10
  },
  infoStat: {
    fontSize: 20,
    margin: 5
  },

  grid: {
    flex: 0
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    height: 32,
    width: 32,
    margin: 1,
    backgroundColor: '#face01',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridCellText: {
    fontSize: 16,
    fontWeight: '400'

  }
});

module.exports = Stats;