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


          {/*
          TODO: Show times with their dates, like:
            Nov 15 [1.60s] [2.10s]
            Nov 2  [2.50s]
            Oct 30 [2.00s]
            Oct 28 [2.35s] [2.10s]
            Then we can show them with the newest times at the top! :D
          */}
          {/*
          TODO: Add a mastery indicator to each time (fast vs slow).
            Maybe a border color? Background color?
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
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    borderWidth: 2 / PixelRatio.get(),
    borderBottomWidth: 4 / PixelRatio.get(),
  },
  infoStatText: {
    fontSize: 13,
    color: '#144956'
  },

  infoDescription: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
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