'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';

import Chart from '../components/Chart';

const StatInfo = React.createClass({
  propTypes: {
    inputs: React.PropTypes.array.isRequired,
    learnerTypingTimes: React.PropTypes.array.isRequired,
    operation: React.PropTypes.string.isRequired,
    timeData: React.PropTypes.array.isRequired,
  },

  render: function() {
    const {
      inputs,
      learnerTypingTimes,
      operation,
      timeData,
    } = this.props;

    const times = timeData[inputs[0]][inputs[1]];

    const OperationHelper = OperationHelpers[operation];
    const expression = OperationHelper.getExpression(inputs);
    const answer = OperationHelper.getAnswer(inputs);

    const factStatus = MasteryHelpers.getFactStatus(
      answer,
      times,
      learnerTypingTimes);
    const masteryColor = MasteryHelpers.masteryColors[factStatus];
    const masteryColorText = MasteryHelpers.masteryTextColors[factStatus];
    const masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    const color = {color: masteryColorText};

    const printTime = (time) => {
      return parseFloat(time/1000).toFixed(2).toString() + 's';
    };

    const statInfo = (
      <View style={[styles.infoContainer]}>
        <AppText style={styles.infoQuestion}>
          {expression}
        </AppText>
        <View style={styles.infoDescription}>
          <AppText
            style={[
              styles.infoDescriptionTitle,
              { backgroundColor: masteryColor, color: masteryColorText}
            ]}
          >
            {factStatus.toUpperCase()}
          </AppText>
          <AppText style={styles.infoDescriptionText}>
            {masteryDescription}
          </AppText>
        </View>

        {/*
        <Chart timeData={times} learnerTypingTimes={learnerTypingTimes} />
        */}

        {times.length > 0 && <View>
          <View style={styles.infoStatsGroup}>
            {_.map(times, (time, idx) => {
              return (
                <View style={styles.infoStat} key={'time-' + idx}>
                  <AppText style={styles.infoStatText}>
                    {printTime(time.time)}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>}
      </View>
    );

    return statInfo;
  }
});

const styles = StyleSheet.create({

  infoContainer: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 10,
    marginTop: 1,
  },
  infoQuestion: {
    color: '#144956',
    fontSize: 40,
    margin: 5,
    marginBottom: 0,
    height: 50,
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
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 2,
    borderRadius: 3,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    alignItems: 'center'
  },
  infoStatText: {
    fontSize: 13,
    color: '#144956'
  },

  infoDescription: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    flexWrap: 'wrap',
  },
  infoDescriptionTitle: {
    borderRadius: 3,
    fontSize: 16,
    marginBottom: 5,
    paddingTop: 3,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  infoDescriptionText: {
    fontSize: 11,
    color: '#144956',
  },
});

module.exports = StatInfo;