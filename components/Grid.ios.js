'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import MasteryHelpers from '../helpers/MasteryHelpers.ios';
import OperationHelper from '../helpers/OperationHelpers.ios';

var GridCell = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    color: React.PropTypes.string,
    content: React.PropTypes.string,
    key: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
    small: React.PropTypes.small,
    textColor: React.PropTypes.string,
  },
  defaultProps: {
    color: '#ddd',
    onPress: null,
    textColor: '#222',
  },
  render: function() {
    const {
      active,
      color,
      content,
      key,
      onPress,
      small,
      textColor,
    } = this.props;

    const gridCellStyles = [
      styles.gridCell,
      { backgroundColor: color },
      active && { borderWidth: 1, borderColor: textColor },
      small && { height: 15, width: 15 }
    ];

    const cellContent = !small && (
      <AppText style={[styles.gridCellText, { color: textColor }]}>
        {content}
      </AppText>
    );

    if (onPress != null) {
      return (
        <TouchableHighlight
            key={key}
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
            key={key}
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
    activeCell: React.PropTypes.array,
    // size
    small: React.PropTypes.bool
  },
  render: function() {
    var operation = this.props.operation;
    var sign = OperationHelper[operation].getSign();
    return (
      <View style={styles.grid}>
        <View
            style={styles.gridRow}
            key={'header-row'}>
          <GridCell content={sign}
                    color='#ddd'
                    key='cell-sign'
                    small={this.props.small} />
          {_.map(_.range(0, 10), (col) => {
            return (
              <GridCell
                content={col + 1}
                color='#eee'
                small={this.props.small}
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
                    small={this.props.small}
                    key={'cell-row-header-' + row}/>
                {_.map(_.range(0, 10), (col) => {
                  var answer = OperationHelper[operation].getAnswer(
                    [row + 1, col + 1]
                  );
                  var times = this.props.timeData[row + 1][col + 1];
                  var timesAnswered = times.length;
                  var bestTime = Math.min.apply(Math, times);
                  var learnerTypingTimes = MasteryHelpers.getLearnerTypingTime(
                    this.props.timeData,
                    operation
                  );
                  var factStatus = MasteryHelpers.getFactStatus(answer, times,
                    learnerTypingTimes);
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
                    small={this.props.small}
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