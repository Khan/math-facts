'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText';
import Keyboard from './Keyboard.js';
import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';
import SH from '../helpers/style-helpers';

const GridCell = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    color: React.PropTypes.string,
    content: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    onPress: React.PropTypes.func,
    small: React.PropTypes.bool,
    textColor: React.PropTypes.string,
  },
  getDefaultProps: function () {
    return {
      color: SH.colors.grey85,
      textColor: SH.colors.grey25,
    };
  },
  render: function() {
    const {
      active,
      color,
      content,
      onPress,
      small,
      textColor,
    } = this.props;

    const activeStyle = { borderWidth: 1, borderColor: textColor };
    const gridCellStyles = [
      styles.gridCell,
      { backgroundColor: color },
      active && activeStyle,
      small && { height: 6, width: 6 }
    ];

    const cellContent = !small && (
      <AppText style={[styles.gridCellText, { color: textColor }]}>
        {content}
      </AppText>
    );

    if (onPress != null) {
      return (
        <Keyboard.Key
          style={gridCellStyles}
          onPress={onPress}
          highlightStyle={{
            borderWidth: 2,
            borderColor: "#fff",
          }}
        >
          <View>
            {cellContent}
          </View>
        </Keyboard.Key>
      );
    } else {
      return (
        <View
            style={gridCellStyles}>
          {cellContent}
        </View>
      );
    }
  }
});

const Grid = React.createClass({
  propTypes: {
    // The active cell as inputs: [row, col]
    activeCell: React.PropTypes.array,
    onPress: React.PropTypes.func,
    operation: React.PropTypes.string,
    // Size of each cell in the grid: small or not-small.
    small: React.PropTypes.bool,
    // The time data as a 2D array of time values: {time: ..., date: ..., ...}
    timeData: React.PropTypes.array,
  },
  render: function() {
    const {
      activeCell,
      onPress,
      operation,
      small,
      timeData,
    } = this.props;

    const OperationHelper = OperationHelpers[operation];
    const sign = OperationHelper.getSign();
    // TODO: abstract this maxVal somewhere else
    const maxVal = 10;
    const cellRange = _.range(1, maxVal + 1);

    const headerCellColor = SH.colors.grey85;
    const operationCellColor = SH.colors.grey90;

    const learnerTypingTimes = MasteryHelpers.getLearnerTypingTimes(
      timeData,
      operation
    );

    const gridOutput = (
      <View style={styles.grid}>
        {/* Render the top row of cells */}
        <View
            style={styles.gridRow}
            key={'header-row'}>
          {/* Render the operation cell in the top left corner */}
          <GridCell
            content={sign}
            color={operationCellColor}
            key='cell-sign'
            small={small} />
          {/* Render the top row of numeric header cells */}
          {_.map(cellRange, (col) => {
            return (
              <GridCell
                content={col}
                color={headerCellColor}
                small={small}
                key={'cell-col-header-' + col}/>
            );
          })}
        </View>

        {/* Render the answer cells */}
        {_.map(cellRange, (row) => {

          {/* Render a row of answer cells */}
          return (
              <View
                  key={'row-' + row}
                  style={styles.gridRow}>
                {/* Render left column of numeric header cells, one per row */}
                <GridCell
                  color={headerCellColor}
                  content={row}
                  key={'cell-row-header-' + row}
                  small={small} />

                {/* Render the answer cells for this row */}
                {_.map(cellRange, (col) => {
                  const answer = OperationHelper.getAnswer([row, col]);
                  const times = timeData[row][col];
                  const timesAnswered = times.length;
                  const bestTime = Math.min.apply(Math, times);

                  const factStatus = MasteryHelpers.getFactStatus(
                    answer,
                    times,
                    learnerTypingTimes);

                  const masteryColor = MasteryHelpers.masteryColors[factStatus];
                  const masteryColorText = MasteryHelpers.masteryTextColors[
                    factStatus
                  ];

                  const active = activeCell != null &&
                               activeCell[0] === row &&
                               activeCell[1] === col;

                  return (<GridCell
                    active={active}
                    color={masteryColor}
                    content={answer}
                    key={'cell-' + row + '-' + col}
                    onPress={onPress ? () => onPress([row, col]) : null}
                    small={small}
                    textColor={masteryColorText} />
                  );
                })}
              </View>
          );
        })}
      </View>
    );

    if (onPress == null) {
      return gridOutput;
    }

    return <Keyboard triggerOnMove={true}>
      {gridOutput}
    </Keyboard>;
  }
});

const styles = StyleSheet.create({
  grid: {
    flex: 0,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 29, // 34 for iPhone 6
    justifyContent: 'center',
    width: 29,
  },
  gridCellText: {
    fontSize: 14, // 16 for iPhone 6
    fontWeight: '400',
  }
});

module.exports = Grid;