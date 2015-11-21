'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

import MasteryHelpers from '../helpers/mastery-helpers';

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

  updateActiveCell: function(active) {
    this.setState({
      active: active
    });
  },

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

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

        <Grid
          activeCell={this.state.active}
          onPress={this.updateActiveCell}
          operation={operation}
          timeData={timeData}
        />

        <StatInfo
          inputs={this.state.active}
          learnerTypingTimes={learnerTypingTimes}
          operation={operation}
          timeData={timeData}
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    justifyContent: 'flex-start'
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
});

module.exports = Stats;