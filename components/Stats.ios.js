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
      timeData: this.getTimeData(),
      active: [1, 1]
    };
  },
  componentWillReceiveProps: function() {
    this.setState({
      timeData: this.getTimeData()
    })
  },
  getTimeData: function() {
    // Size must be larger than the max size of the values that are added
    return _.map(_.range(0, 12), (left) => {
      return _.map(_.range(0, 12), (right) => {
        if (this.props.quizzesData[left] != null) {
          if (this.props.quizzesData[left][right] != null) {
            return this.props.quizzesData[left][right];
          }
        }
        return [];
      });
    });
  },
  render: function() {
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
    var bestTime = 0;
    _.each(times, (data) => {
      if (data != null && (bestTime === 0 || data.time < bestTime)) {
        bestTime = data.time;
      }
    });
    var bestTimePrint = parseFloat(bestTime/1000).toFixed(2);

    var inputs = [activeRow, activeCol];
    var expression = OperationHelper[operation].getExpression(inputs);
    var answer = OperationHelper[operation].getAnswer(inputs);

    var factStatus = MasteryHelpers.getFactStatus(answer, times);
    var masteryColor = MasteryHelpers.masteryColors[factStatus];
    var masteryColorText = MasteryHelpers.masteryTextColors[factStatus];
    var masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    var infoStatTextStyle = styles.infoStatText;
    var color = {color: masteryColorText};
    var info = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
        <View style={styles.infoStats}>
          <View style={styles.infoStat}>
            <AppText style={infoStatTextStyle}>
              {timesAnswered + ' attempt' + (timesAnswered !== 1 ? 's' : '')}
            </AppText>
          </View>
          {(timesAnswered > 0 && bestTimePrint > 0) ?
          <View style={styles.infoStat}>
            <AppText style={infoStatTextStyle}>
              {'Best time: ' + bestTimePrint + 's'}
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

    return (
      <View style={styles.container}>
        <BackButton onPress={this.props.back} />
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

  infoContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    marginTop: 1
  },
  infoQuestion: {
    fontSize: 40,
    margin: 5
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
    borderRadius: 12
  },
  infoStatText: {
    fontSize: 15,
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