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

var ColorHelpers = require('./ColorHelpers.ios');
var MasteryHelpers = require('./MasteryHelpers.ios');

var GridCell = React.createClass({
  defaultProps: {
    content: React.PropTypes.string,
    color: React.PropTypes.string,
    textColor: React.PropTypes.string,
    key: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
  },
  render: function() {
    var onPress = this.props.onPress || null;
    var color = this.props.color || '#ddd';
    var textColor = this.props.textColor || '#222';
    if (onPress) {
      return (
        <TouchableHighlight
            key={this.props.key}
            style={[styles.gridCell, {backgroundColor: color}]}
            underlayColor="transparent"
            onPress={onPress}>
          <Text style={[styles.gridCellText, {color: textColor}]}>
            {this.props.content}
          </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <View
            key={this.props.key}
            style={[styles.gridCell, {backgroundColor: color}]}>
          <Text style={[styles.gridCellText, {color: textColor}]}>
            {this.props.content}
          </Text>
        </View>
      );
    }

  }
});

var Grid = React.createClass({
  defaultProps: {
    timeData: React.PropTypes.array,
    mode: React.PropTypes.string,
    onPress: React.PropTypes.func
  },
  render: function() {
    var sign = this.props.mode === 'addition' ? '+' : 'x';
    return (
      <View style={styles.grid}>
        <View
            style={styles.gridRow}
            key={'header-row'}>
          <GridCell content={sign} color='#ddd' key='cell-sign' />
          {_.map(_.range(0, 10), (col) => {
            return (
              <GridCell
                content={col + 1}
                color='#eee'
                key={'cell-col-header-' + col}/>
            );
          })}
        </View>
        {_.map(_.range(0, 10), (row) => {
          return (
              <View style={styles.gridRow} key={'row-' + row}>
                  <GridCell
                    content={row + 1}
                    color='#eee'
                    key={'cell-row-header-' + row}/>
                {_.map(_.range(0, 10), (col) => {
                  var times = this.props.timeData[row + 1][col + 1];
                  var timesAnswered = times.length;
                  var bestTime = Math.min.apply(Math, times);
                  var masteryLevel = MasteryHelpers.masteryLevel(times);
                  var masteryColor = MasteryHelpers.masteryColors[masteryLevel];
                  var masteryColorText = MasteryHelpers.masteryTextColors[
                    masteryLevel
                  ];

                  var answer = this.props.mode === 'addition' ?
                                (row + 1) + (col + 1) :
                                (row + 1) * (col + 1);
                  return (<GridCell
                    content={answer}
                    color={masteryColor}
                    textColor={masteryColorText}
                    key={'cell-' + row + '-' + col}
                    onPress={() => {
                      this.props.onPress([row + 1, col + 1]);
                    }}/>
                  );
                })}
              </View>
          );
        })}
      </View>
    );
  }
});

var Stats = React.createClass({
  propTypes: {

  },
  getInitialState: function() {
    return {
      timeData: this.getInitialQuizzesData(),
      active: [1, 1]
    };
  },
  getInitialQuizzesData: function() {
    // Size must be larger than the max size of the values that are added
    return _.map(_.range(0, 12), () => {
      return _.map(_.range(0, 12), () => { return []; });
    });
  },
  componentWillReceiveProps: function(newProps) {
    var timeData = this.getInitialQuizzesData();

    _.each(newProps.quizzesData, (obj, index) => {
      var id = obj._id;
      var quizData = obj.quizData;
      _.each(quizData, (data) => {
        if (data.type === this.props.mode) {
          if (timeData[data.left][data.right].length === 0) {
            timeData[data.left][data.right].length = [];
          }
          timeData[data.left][data.right].push(data.time);
        }
      });
    });

    this.setState({
      timeData: timeData
    });
  },
  render: function() {

    var sign = this.props.mode === 'addition' ? '+' : 'x';
    var grid = <Grid
      timeData={this.state.timeData}
      mode={this.props.mode}
      onPress={(active) => {
        this.setState({
          active: active
        });
      }} />

    var activeRow = this.state.active[0];
    var activeCol = this.state.active[1];

    var times = this.state.timeData[activeRow][activeCol];
    var timesAnswered = times.length;
    var bestTimeInMilliseconds = Math.min.apply(Math, times);
    var bestTime = parseFloat(bestTimeInMilliseconds/1000).toFixed(2);

    var masteryLevel = MasteryHelpers.masteryLevel(times);
    var masteryColor = MasteryHelpers.masteryColors[masteryLevel];
    var masteryColorText = MasteryHelpers.masteryTextColors[masteryLevel];

    var answer = this.props.mode === 'addition' ?
                  (activeRow) + (activeCol) :
                  (activeRow) * (activeCol);

    var infoStatTextStyle = styles.infoStatText;
    var info = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <Text style={[styles.infoQuestion, {color: masteryColorText}]}>
          {activeRow + ' ' + sign + ' ' + activeCol + ' = ' +
            answer}
        </Text>
        <View style={styles.infoStats}>
          <View style={styles.infoStat}>
            <Text style={infoStatTextStyle}>
              {timesAnswered + ' attempt' + (timesAnswered !== 1 ? 's' : '')}
            </Text>
          </View>
          {(timesAnswered > 0 && bestTime > 0) ?
          <View style={styles.infoStat}>
            <Text style={infoStatTextStyle}>
              {'Best time: ' + bestTime + 's'}
            </Text>
          </View> : null}
        </View>
      </View>
    );

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
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    marginTop: 1
  },
  infoQuestion: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 10
  },
  infoStats: {
    flexDirection: 'row'
  },
  infoStat: {
    margin: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 10
  },
  infoStatText: {
    fontSize: 15,
    color: '#144956'
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
    height: 29, // 34 for iPhone 6
    width: 29,
    backgroundColor: '#face01',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridCellText: {
    fontSize: 14, // 16 for iPhone 6
    fontWeight: '400'

  }
});

module.exports = Stats;