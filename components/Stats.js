'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  View,
} = React;

import { AppText, AppTextBold } from './AppText';

import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';
import SH from '../helpers/style-helpers';

import BackButton from '../components/BackButton';

import Grid from '../components/Grid';
import StatInfo from '../components/StatInfo';

const Stats = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    operation: React.PropTypes.string.isRequired,
    timeData: React.PropTypes.array.isRequired,
  },
  getInitialState: function() {
    return {
      active: [1, 1]
    };
  },

  updateActiveCell: _.throttle(function(active) {
    this.setState({
      active: active
    });
  }, 20),

  render: function() {
    const {
      goBack,
      operation,
      timeData,
    } = this.props;

    const learnerTypingTimes = MasteryHelpers.getLearnerTypingTimes(
      this.props.timeData,
      operation
    );

    const totalQuestionsAnswered = timeData.reduce(function(total, row) {
      return total + row.reduce(function (innerTotal, col) {
        return innerTotal + col.length;
      }, 0);
    }, 0);

    const showGrid = OperationHelpers[operation].showGrid;

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
          <AppText style={styles.topRowText}>
            Total answered: <AppTextBold>
              {totalQuestionsAnswered}</AppTextBold>
          </AppText>
        </View>

        {showGrid && [<Grid
            activeCell={this.state.active}
            onPress={this.updateActiveCell}
            operation={operation}
            timeData={timeData}
          />,
          <StatInfo
            inputs={this.state.active}
            learnerTypingTimes={learnerTypingTimes}
            operation={operation}
            timeData={timeData}
          />]}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: SH.colors.backgroundColor,
    justifyContent: 'flex-start'
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  topRowText: {
    fontSize: 12,
    paddingRight: 15,
    paddingTop: 23,
  },
});

module.exports = Stats;