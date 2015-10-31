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

    const timesAnswered = times.length;
    let bestTime = null;
    _.each(times, (data) => {
      if (data != null && (bestTime == null || data.time < bestTime)) {
        bestTime = data.time;
      }
    });

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

    const info = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
        <View style={styles.infoStatsGroup}>
          <View style={styles.infoStat}>
            <AppText style={styles.infoStatText}>
              {timesAnswered + ' attempt' + (timesAnswered !== 1 ? 's' : '')}
            </AppText>
          </View>
          {(timesAnswered > 0 && bestTime != null) ?
          <View style={styles.infoStat}>
            <AppText style={styles.infoStatText}>
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


    const timesArr = [];
    _.each(times, (data) => {
      timesArr.push(data.time);
    });

    const findAverage = (arr) => {
      if (arr.length === 0) {
        return null;
      }
      const sum = arr.reduce((a, b) => {
        return a + b;
      }, 0);
      return sum / arr.length;
    };

    // TODO: Reject outliers from these stats (e.g. times > 20 seconds because
    // they got distracted or something)
    const avg = findAverage(timesArr);

    // Calculate standard deviation
    const squareDifferences = timesArr.map((time) => {
      const difference = time - avg;
      return difference * difference;
    });

    const stdDev = Math.sqrt(findAverage(squareDifferences));

    const statInfo = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>

        <Chart timeData={times} learnerTypingTimes={learnerTypingTimes} />

        {timesArr.length > 0 && <View>
          <View style={styles.infoStatsGroup}>
            {_.map(timesArr, (time, idx) => {
              return (
                <View style={styles.infoStat} key={'time-' + idx}>
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
    paddingLeft: 6,
    paddingRight: 6,
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
});

module.exports = StatInfo;