'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

var { AppText, AppTextBold, AppTextThin } = require('./AppText.ios');

var ColorHelpers = require('../helpers/ColorHelpers.ios');
var MasteryHelpers = require('../helpers/MasteryHelpers.ios');
var OperationHelper = require('../helpers/OperationHelpers.ios');

var BackButton = require('../components/BackButton.ios');

var GridCell = React.createClass({
  defaultProps: {
    content: React.PropTypes.string,
    color: React.PropTypes.string,
    textColor: React.PropTypes.string,
    key: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
    active: React.PropTypes.bool,
  },
  render: function() {
    var onPress = this.props.onPress || null;
    var color = this.props.color || '#ddd';
    var textColor = this.props.textColor || '#222';
    var gridCellStyles = [
      styles.gridCell,
      {backgroundColor: color},
      this.props.active ? {borderWidth: 1, borderColor: textColor} : null,
    ];
    var cellContent = (
      <AppText style={[styles.gridCellText, {color: textColor}]}>
        {this.props.content}
      </AppText>
    );

    if (onPress != null) {
      return (
        <TouchableHighlight
            key={this.props.key}
            style={gridCellStyles}
            underlayColor='transparent'
            onPress={onPress}>
          <View>
            {cellContent}
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <View
            key={this.props.key}
            style={gridCellStyles}>
          {cellContent}
        </View>
      );
    }

  }
});

var Grid = React.createClass({
  defaultProps: {
    timeData: React.PropTypes.array,
    operation: React.PropTypes.string,
    onPress: React.PropTypes.func,
    // The active cell as inputs: [row, col]
    activeCell: React.PropTypes.array
  },
  render: function() {
    var operation = this.props.operation;
    var sign = OperationHelper[operation].getSign();
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
                  var answer = OperationHelper[operation].getAnswer(
                    [row + 1, col + 1]
                  );
                  var times = this.props.timeData[row + 1][col + 1];
                  var timesAnswered = times.length;
                  var bestTime = Math.min.apply(Math, times);
                  var factStatus = MasteryHelpers.getFactStatus(answer, times);
                  var masteryColor = MasteryHelpers.masteryColors[factStatus];
                  var masteryColorText = MasteryHelpers.masteryTextColors[
                    factStatus
                  ];

                  var activeCell = this.props.activeCell;
                  var active = activeCell != null &&
                               activeCell[0] === row + 1 &&
                               activeCell[1] === col + 1;

                  return (<GridCell
                    content={answer}
                    active={active}
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
      timeData: [],
      active: [1, 1]
    };
  },
  componentDidMount: function() {
    if (this.props.quizzesData != null) {
      this.loadTimeData(this.props.quizzesData);
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (this.state.timeData.length === 0 && newProps.quizzesData != null) {
      this.loadTimeData(newProps.quizzesData);
    }
  },
  loadTimeData: function (quizzesData) {
    this.setState({
      timeData: this.getTimeData(quizzesData),
      loaded: true
    });
  },
  getTimeData: function(quizzesData) {
    // Size must be larger than the max size of the values that are added
    return _.map(_.range(0, 12), (left) => {
      return _.map(_.range(0, 12), (right) => {
        if (quizzesData[left] != null && quizzesData[left][right] != null) {
          return quizzesData[left][right];
        }
        return [];
      });
    });
  },
  render: function() {
    if (this.state.loaded) {
      return this.renderStats();
    }
    return (
      <View style={styles.loading}>
        <AppText>Loading...</AppText>
      </View>
    );
  },
  renderStats: function() {
    var operation = this.props.operation;
    var grid = <Grid
      timeData={this.state.timeData}
      operation={operation}
      activeCell={this.state.active}
      onPress={(active) => {
        this.setState({
          active: active
        });
      }} />

    var activeRow = this.state.active[0];
    var activeCol = this.state.active[1];

    var times = this.state.timeData[activeRow][activeCol];
    var timesAnswered = times.length;
    var bestTime = null;
    _.each(times, (data) => {
      if (data != null && (bestTime == null || data.time < bestTime)) {
        bestTime = data.time;
      }
    });

    var inputs = [activeRow, activeCol];
    var expression = OperationHelper[operation].getExpression(inputs);
    var answer = OperationHelper[operation].getAnswer(inputs);

    var factStatus = MasteryHelpers.getFactStatus(answer, times);
    var masteryColor = MasteryHelpers.masteryColors[factStatus];
    var masteryColorText = MasteryHelpers.masteryTextColors[factStatus];
    var masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    var infoStatTextStyle = styles.infoStatText;
    var color = {color: masteryColorText};


    var printTime = (time) => {
      return parseFloat(time/1000).toFixed(2).toString() + 's';
    };

    var info = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
        <View style={styles.infoStatsGroup}>
          <View style={styles.infoStat}>
            <AppText style={infoStatTextStyle}>
              {timesAnswered + ' attempt' + (timesAnswered !== 1 ? 's' : '')}
            </AppText>
          </View>
          {(timesAnswered > 0 && bestTime != null) ?
          <View style={styles.infoStat}>
            <AppText style={infoStatTextStyle}>
              {'Best time: ' + printTime(bestTime)}
            </AppText>
          </View> : null}
        </View>
          <View style={styles.infoDescription}>
            <AppText style={[styles.infoDescriptionTitle, color]}>
              {factStatus.toUpperCase()}
            </AppText>
            <AppText style={[styles.infoDescriptionText, color]}>
              {masteryDescription}
            </AppText>
          </View>
      </View>
    );


    var timesArr = [];
    _.each(times, (data) => {
      timesArr.push(data.time);
    });

    var findAverage = (arr) => {
      var sum = arr.reduce((a, b) => {
        return a + b;
      }, 0);
      return sum / arr.length;
    };

    // TODO: Reject outliers from these stats (e.g. times > 20 seconds because
    // they got distracted or something)
    var avg = findAverage(timesArr);

    // Calculate standard deviation
    var squareDifferences = timesArr.map((time) => {
      var difference = time - avg;
      return difference * difference;
    });

    var stdDev = Math.sqrt(findAverage(squareDifferences));

    var lotsOfInfo = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
        <View>
          <View style={styles.infoStatsGroup}>
            {_.map(timesArr, (time) => {
              return (
                <View style={styles.infoStat}>
                  <AppText style={styles.infoStatText}>
                    {printTime(time)}
                  </AppText>
                </View>
              );
            })}
          </View>
          <View style={styles.infoStat}>
            <AppText style={styles.infoStatText}>
              {'Avg ' + printTime(avg) + ' ± ' + printTime(stdDev)}
            </AppText>
          </View>
        </View>

      </View>
    );

    return (
      <View style={styles.container}>
        <BackButton onPress={this.props.back} />
        {grid}
        {lotsOfInfo}
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContainer: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 10,
    marginTop: 1,
  },
  infoQuestion: {
    fontSize: 40,
    margin: 5,
    alignSelf: 'center'
  },
  infoStatsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  infoStat: {
    margin: 2,
    backgroundColor: '#fff',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 10,
    alignItems: 'center'
  },
  infoStatText: {
    fontSize: 13,
    color: '#144956'
  },

  infoDescription: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    flexWrap: 'wrap'
  },
  infoDescriptionTitle: {
    fontSize: 16
  },
  infoDescriptionText: {
    fontSize: 11
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