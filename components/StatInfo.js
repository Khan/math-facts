'use strict';

import _ from 'underscore';
import moment from 'moment';
import React from 'react-native';
const {
  PixelRatio,
  ScrollView,
  StyleSheet,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

import Helpers from '../helpers/helpers';
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

    const masteryTitle  = MasteryHelpers.masteryTitle[factStatus];
    const masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    const numTimesCounted = Math.min(times.length, 10);
    let count = 0;
    const totalStatuses = {
      hint: 0,
      fast: 0,
      slow: 0,
    };

    // Group the facts by date, with the newest date at the top
    const sortedTimes = times.slice().reverse();
    const sortedTimesByDate = {};
    sortedTimes.forEach((time) => {
      const d = new Date(time.date);
      // Display the date as a string like "Oct 31"
      const key = moment(d).format("MMM D");
      if (sortedTimesByDate[key] == null) {
        sortedTimesByDate[key] = [];
      }
      const status = MasteryHelpers.isFluent(
        answer, time.time, learnerTypingTimes);
      // TODO: This probably isn't counting things right.... we don't want to
      // use hints to bump off actual time data because then it might get out
      // sync with what we're calculating for your mastery level
      if (count < numTimesCounted) {
        const index = time.hintUsed ? 'hint' : (status ? 'fast' : 'slow');
        totalStatuses[index] = totalStatuses[index] + 1;
        count++;
      }

      sortedTimesByDate[key].push({
        ...time,
        status: status,
      });
    });

    const timeByDateOutput = _.map(
      sortedTimesByDate,
      (timesArrayForThisDate, date) => {
        return <View
          style={styles.infoStatsGroup}
          key={date}
        >
          <View>
            <AppText style={styles.infoStatLabel}>
              {date.toUpperCase()}
            </AppText>
          </View>
          <View style={styles.infoStatsData}>
          {timesArrayForThisDate.map((time, idx) => {
            const color = time.status ?
                MasteryHelpers.masteryColors.mastered :
                MasteryHelpers.masteryColors.struggling;
            return (
              <View
                style={[
                  styles.infoStat,
                  !time.hintUsed && { borderBottomColor: color}
                ]}
                key={idx}
              >
                <AppText style={styles.infoStatText}>
                  {time.hintUsed ? 'HINT' : Helpers.printTime(time.time)}
                </AppText>
              </View>
            );
          })}
          </View>
        </View>
      }
    );

    const statInfo = (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.infoContainer}>
          <AppText style={styles.infoQuestion}>
            {expression}
          </AppText>
          <View style={styles.infoDescription}>
            <View style={[
                styles.infoDescriptionTitle,
                { backgroundColor: masteryColor }
              ]}
            >
              <AppText style={[
                  styles.infoDescriptionTitleText,
                  { color: masteryColorText },
                ]}
              >
                {masteryTitle.toUpperCase()}
              </AppText>
            </View>
            <AppText style={styles.infoDescriptionText}>
              {masteryDescription}
            </AppText>
          </View>

          <View style={styles.divider} />

          {numTimesCounted > 0 && <View style={styles.totalStats}>
            <AppText style={styles.totalStatsText}>
              {'Last '}
            </AppText>
            <View style={styles.totalEm}>
              <AppText style={styles.totalStatsText}>
                {numTimesCounted}
              </AppText>
            </View>
            <AppText style={styles.totalStatsText}>
              {' tries: '}
            </AppText>
            <View style={[styles.totalEm, { backgroundColor: '#1c758a' }]}>
              <AppText style={[styles.totalStatsText, { color: '#f7feff' }]}>
                {totalStatuses.fast}
              </AppText>
            </View>
            <AppText style={styles.totalStatsText}>
              {' fast'}
            </AppText>
            {totalStatuses.slow > 0 && <View style={styles.totalStats}>
              <AppText style={styles.totalStatsText}>
                {' '}
              </AppText>
              <View style={[styles.totalEm, { backgroundColor: '#c30202' }]}>
                <AppText style={[styles.totalStatsText, { color: '#ffdfdf' }]}>
                  {totalStatuses.slow}
                </AppText>
              </View>
              <AppText style={styles.totalStatsText}>
                {' slow'}
              </AppText>
            </View>}
            {totalStatuses.hint > 0 && <View style={styles.totalStats}>
              <AppText style={styles.totalStatsText}>
                {' '}
              </AppText>
              <View style={styles.totalEm}>
                <AppText style={styles.totalStatsText}>
                  {totalStatuses.hint}
                </AppText>
              </View>
              <AppText style={styles.totalStatsText}>
                {' hints'}
              </AppText>
            </View>}
          </View>}

          {numTimesCounted > 0 && <View style={styles.divider} />}

          {/*
          <Chart timeData={times} learnerTypingTimes={learnerTypingTimes} />
          */}

          {timeByDateOutput}


          {timeByDateOutput.length > 0 && <View style={styles.divider} />}

          <View>
            <AppText style={styles.timeGoalText}>
              {'Time goal: ' +
                Helpers.printTime(
                  MasteryHelpers.getGoalTime(answer, learnerTypingTimes)
                )
              }
            </AppText>
          </View>

        </View>
      </ScrollView>
    );

    return statInfo;
  }
});

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    width: 320,
  },
  infoContainer: {
    flex: 1,
    padding: 8,
    marginTop: 1,
  },
  infoQuestion: {
    textAlign: 'center',
    color: '#144956',
    fontSize: 40,
    height: 50,
  },
  infoStatsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  infoStatLabel: {
    color: '#999',
    fontSize: 13,
    paddingTop: 6,
    paddingRight: 6,
    textAlign: 'right',
    width: 67,
  },
  infoStatsData: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  infoStat: {
    margin: 2,
    backgroundColor: '#fff',
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 2,
    borderRadius: 3,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderWidth: 1,
    borderBottomWidth: 2,
  },
  infoStatText: {
    fontSize: 13,
    color: '#144956'
  },

  infoDescription: {
    alignItems: 'center',
    marginTop: 5,
  },
  infoDescriptionTitle: {
    borderRadius: 3,
    marginBottom: 5,
    paddingTop: 3,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  infoDescriptionTitleText: {
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  infoDescriptionText: {
    fontSize: 11,
    color: '#144956',
    textAlign: 'center',
  },

  divider: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 10,
  },

  totalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalStatsText: {
    color: '#144956',
  },
  totalEm: {
    backgroundColor: '#ddd',
    borderRadius: 3,
    paddingLeft: 5,
    paddingRight: 5,
  },
  timeGoalText: {
    color: '#999',
    fontSize: 11,
    textAlign: 'center',
  },
});

module.exports = StatInfo;
