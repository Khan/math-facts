'use strict';

import _ from 'underscore';

import React from 'react-native';
var {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import MasteryHelpers from '../helpers/MasteryHelpers.ios';
import OperationHelper from '../helpers/OperationHelpers.ios';

import BackButton from '../components/BackButton.ios';

import Grid from '../components/Grid.ios';

var Stats = React.createClass({
  propTypes: {

  },
  getInitialState: function() {
    return {
      timeData: [],
      active: [1, 1]
    };
  },
  componentDidMount: function() {
    if (this.props.timeData != null) {
      this.loadTimeData(this.props.timeData);
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (this.state.timeData.length === 0 && newProps.timeData != null) {
      this.loadTimeData(newProps.timeData);
    }
  },
  loadTimeData: function (timeData) {
    this.setState({
      timeData: timeData,
      loaded: true
    });
  },
  render: function() {
    if (this.state.loaded) {
      return this.renderStats();
    }
    return (
      <View style={styles.loading}>
        <AppText>Loading...</AppText>
      </View>
    );
  },
  renderStats: function() {
    var operation = this.props.operation;

    var learnerTypingTimes = MasteryHelpers.getLearnerTypingTime(
      this.props.timeData,
      operation
    );

    var grid = <Grid
      timeData={this.state.timeData}
      operation={operation}
      activeCell={this.state.active}
      onPress={(active) => {
        this.setState({
          active: active
        });
      }} />

    var activeRow = this.state.active[0];
    var activeCol = this.state.active[1];

    var times = this.state.timeData[activeRow][activeCol];
    var timesAnswered = times.length;
    var bestTime = null;
    _.each(times, (data) => {
      if (data != null && (bestTime == null || data.time < bestTime)) {
        bestTime = data.time;
      }
    });

    var inputs = [activeRow, activeCol];
    var expression = OperationHelper[operation].getExpression(inputs);
    var answer = OperationHelper[operation].getAnswer(inputs);

    var factStatus = MasteryHelpers.getFactStatus(answer, times, learnerTypingTimes);
    var masteryColor = MasteryHelpers.masteryColors[factStatus];
    var masteryColorText = MasteryHelpers.masteryTextColors[factStatus];
    var masteryDescription  = MasteryHelpers.masteryDescription[factStatus];

    var infoStatTextStyle = styles.infoStatText;
    var color = {color: masteryColorText};


    var printTime = (time) => {
      return parseFloat(time/1000).toFixed(2).toString() + 's';
    };

    var info = (
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


    var timesArr = [];
    _.each(times, (data) => {
      timesArr.push(data.time);
    });

    var findAverage = (arr) => {
      if (arr.length === 0) {
        return null;
      }
      var sum = arr.reduce((a, b) => {
        return a + b;
      }, 0);
      return sum / arr.length;
    };

    // TODO: Reject outliers from these stats (e.g. times > 20 seconds because
    // they got distracted or something)
    var avg = findAverage(timesArr);

    // Calculate standard deviation
    var squareDifferences = timesArr.map((time) => {
      var difference = time - avg;
      return difference * difference;
    });

    var stdDev = Math.sqrt(findAverage(squareDifferences));

    var n = 0;
    var lotsOfInfo = (
      <View style={[styles.infoContainer, { backgroundColor: masteryColor }]}>
        <AppText style={[styles.infoQuestion, color]}>
          {expression}
        </AppText>
        {timesArr.length > 0 && <View>
          <View style={styles.infoStatsGroup}>
            {_.map(timesArr, (time) => {
              return (
                <View style={styles.infoStat} key={'time-' + (n++)}>
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

var styles = StyleSheet.create({
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