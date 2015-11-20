'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  PixelRatio,
  ScrollView,
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

    const masteryTitle  = MasteryHelpers.masteryTitle[factStatus];
    const masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    const color = {color: masteryColorText};

    const printTime = (time) => {
      return parseFloat(time/1000).toFixed(2).toString() + 's';
    };

    // Group the facts by date, with the newest date at the top
    const sortedTimes = {};
    times.slice().reverse().forEach((time) => {
      const d = new Date(time.date);
      // d.toLocaleString() returns a string like:
      // "October 31, 2015 at 3:32:32 PM PDT"
      // We want to turn it into a string that looks like:
      // "Oct 31"
      // Do this by removing the comma, splitting it up into words, and
      // taking the first 3 letters of the first word and the whole second
      // word (which is the date number).
      const dateParts = d.toLocaleString().replace(/,/g, '').split(' ');
      const key = dateParts[0].slice(0, 3) + ' ' + dateParts[1];
      if (sortedTimes[key] == null) {
        sortedTimes[key] = [];
      }
      sortedTimes[key].push(time)
    });

    const statInfo = (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.infoContainer}>
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
              {masteryTitle.toUpperCase()}
            </AppText>
            <AppText style={styles.infoDescriptionText}>
              {masteryDescription}
            </AppText>
          </View>

          {/*
          <Chart timeData={times} learnerTypingTimes={learnerTypingTimes} />
          */}

          {_.map(sortedTimes, (timesArray, date) => {
            return <View
              style={styles.infoStatsGroup}
              key={'time-group-' + date}
            >
              <View>
                <AppText style={styles.infoStatLabel}>
                  {date.toUpperCase()}
                </AppText>
              </View>
              <View style={styles.infoStatsData}>
              {timesArray.map((time, idx) => {
                const timeStatus = MasteryHelpers.isFluent(
                  answer, time.time, learnerTypingTimes);
                const color = timeStatus ?
                    MasteryHelpers.masteryColors.mastered :
                    MasteryHelpers.masteryColors.struggling;
                return (
                  <View
                    style={[
                      styles.infoStat,
                      !time.hintUsed && { borderBottomColor: color}
                    ]}
                    key={'time-' + idx}
                  >
                    <AppText style={styles.infoStatText}>
                      {time.hintUsed ? 'HINT' : printTime(time.time)}
                    </AppText>
                  </View>
                );
              })}
              </View>
            </View>
          })}
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
    borderWidth: 2 / PixelRatio.get(),
    borderBottomWidth: 4 / PixelRatio.get(),
  },
  infoStatText: {
    fontSize: 13,
    color: '#144956'
  },

  infoDescription: {
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 5,
    paddingBottom: 10,
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
    textAlign: 'center',
  },
});

module.exports = StatInfo;