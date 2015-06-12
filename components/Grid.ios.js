'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

var { AppText, AppTextBold, AppTextThin } = require('./AppText.ios');

var MasteryHelpers = require('../helpers/MasteryHelpers.ios');
var OperationHelper = require('../helpers/OperationHelpers.ios');

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
    // The time data as a 2D array of time values: {time: ..., date: ..., ...}
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

var styles = StyleSheet.create({
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

module.exports = Grid;