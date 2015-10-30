'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelper from '../helpers/operation-helpers';

import BackButton from '../components/BackButton.ios';

import Grid from '../components/Grid.ios';

const Stats = React.createClass({
  propTypes: {

  },
  getInitialState: function() {
    return {
      active: [1, 1]
    };
  },

  render: function() {
    const operation = this.props.operation;

    const learnerTypingTimes = MasteryHelpers.getLearnerTypingTime(
      this.props.timeData,
      operation
    );

    const grid = <Grid
      timeData={this.props.timeData}
      operation={operation}
      activeCell={this.state.active}
      onPress={(active) => {
        this.setState({
          active: active
        });
      }} />

    const activeRow = this.state.active[0];
    const activeCol = this.state.active[1];

    const times = this.props.timeData[activeRow][activeCol];
    const timesAnswered = times.length;
    const bestTime = null;
    _.each(times, (data) => {
      if (data != null && (bestTime == null || data.time < bestTime)) {
        bestTime = data.time;
      }
    });

    const inputs = [activeRow, activeCol];
    const expression = OperationHelper[operation].getExpression(inputs);
    const answer = OperationHelper[operation].getAnswer(inputs);

    const factStatus = MasteryHelpers.getFactStatus(answer, times, learnerTypingTimes);
    const masteryColor = MasteryHelpers.masteryColors[factStatus];
    const masteryColorText = MasteryHelpers.masteryTextColors[factStatus];
    const masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    const infoStatTextStyle = styles.infoStatText;
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
            <AppText style={infoStatTextStyle}>
              {timesAnswered + ' attempt' + (timesAnswered !== 1 ? 's' : '')}
            </AppText>
          </View>
          {(timesAnswered > 0 && bestTime != null) ?
          <View style={styles.infoStat}>
            <AppText style={infoStatTextStyle}>
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

    const lotsOfInfo = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
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

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <BackButton onPress={this.props.back} />
          <AppText style={styles.typingTime}>
            {'Typing time: ' +
              learnerTypingTimes[0] + ', ' + learnerTypingTimes[1]}
          </AppText>
        </View>
        {grid}
        {lotsOfInfo}
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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

module.exports = Stats;