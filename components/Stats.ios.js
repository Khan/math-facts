'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import MasteryHelpers from '../helpers/mastery-helpers';

import BackButton from '../components/BackButton.ios';

import Grid from '../components/Grid.ios';
import StatInfo from '../components/StatInfo.ios';

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

    const learnerTypingTimes = MasteryHelpers.getLearnerTypingTime(
      this.props.timeData,
      operation
    );

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
          <AppText style={styles.typingTime}>
            {'Typing time: ' +
              learnerTypingTimes[0] + ', ' + learnerTypingTimes[1]}
          </AppText>
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

  typingTime: {
    fontSize: 12,
    padding: 17
  },
});

module.exports = Stats;