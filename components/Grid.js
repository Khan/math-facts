'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import { AppText, AppTextBold } from './AppText';
import Keyboard from './Keyboard';
import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';
import SH from '../helpers/style-helpers';

const GridCell = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    content: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    onPress: React.PropTypes.func,
    small: React.PropTypes.bool,
    textColor: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      active: false,
    };
  },
  getDefaultProps: function () {
    return {
      color: SH.colors.grey85,
      textColor: SH.colors.grey25,
    };
  },
  setActive: function(activeState) {
    this.setState({
      active: activeState,
    });
  },
  render: function() {
    const {
      color,
      content,
      onPress,
      small,
      textColor,
    } = this.props;
    const active = this.state.active;

    const activeStyle = {
      borderWidth: 2,
      borderColor: "#fff",
      opacity: 0.76,
    };
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
          highlightStyle={activeStyle}
        >
          <View style={styles.flexFix}>
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
    // The time data as a 2D array of time values:
    // {time: ..., date: ..., ...}
    timeData: React.PropTypes.array,
  },
  componentWillUpdate: function(newProps) {
    this.shouldUpdate = this.props.operation != newProps.operation ||
      this.props.timeData != newProps.timeData;
  },
  componentDidMount: function() {
    if (this.props.activeCell) {
      this.refs[this.createKey(this.props.activeCell)].setActive(true);
    }
  },
  componentDidUpdate: function(oldProps) {
    if (oldProps.activeCell) {
      this.refs[this.createKey(oldProps.activeCell)].setActive(false);
    }
    if (this.props.activeCell) {
      this.refs[this.createKey(this.props.activeCell)].setActive(true);
    }
  },
  shouldUpdate: true,
  createKey: function(index) {
    return `cell-${index[0]}-${index[1]}`;
  },
  render: function() {
    if (!this.shouldUpdate) {
      return this.gridOutput;
    }

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

                  const masteryColor = MasteryHelpers
                    .masteryColors[factStatus];
                  const masteryColorText = MasteryHelpers
                    .masteryTextColors[factStatus];

                  const key = this.createKey([row, col]);
                  return (<GridCell
                    color={masteryColor}
                    content={answer}
                    key={key}
                    onPress={onPress ? () => onPress([row, col]) : null}
                    ref={key}
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
      this.gridOutput = gridOutput;
    } else {
      this.gridOutput = <Keyboard triggerOnMove={true}>
        {gridOutput}
      </Keyboard>;
    }

    return this.gridOutput;
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
  },
  flexFix: {
    // Fix for Safari to make button text centered vertically because buttons
    // don't handle display: flex well in Safari.
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
});

module.exports = Grid;