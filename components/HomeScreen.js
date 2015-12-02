'use strict';

import _ from 'underscore';
import moment from 'moment';
import React from 'react-native';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText';

import Grid from '../components/Grid';

import EggScene from '../components/EggScene';
import Icon from '../components/Icon';

import Button from '../components/Button';
import BackButton from '../components/BackButton';
import SH from '../helpers/style-helpers';

const HomeScreen = React.createClass({
  propTypes: {
    operation: React.PropTypes.string.isRequired,
    points: React.PropTypes.number.isRequired,
    scores: React.PropTypes.array.isRequired,
    showSettings: React.PropTypes.func.isRequired,
    showStats: React.PropTypes.func.isRequired,
    startGame: React.PropTypes.func.isRequired,
    timeData: React.PropTypes.array,
    userName: React.PropTypes.string.isRequired,
  },
  getPointsToday: function() {
    const scores = this.props.scores.slice();
    const today = new Date();
    return scores.reduce((total, score) => {
      if (score.date && moment(today).isSame(score.date, 'day')) {
        return total + score.score;
      }
      return total;
    }, 0);
  },
  getStreak: function() {
    // TODO: make the streak (and points in general) take into account which
    // operation they're for.
    const scores = this.props.scores.slice().reverse();
    const streak = {};
    scores.forEach((score) => {
      if (!score.date) {
        return;
      }
      const d = new Date(score.date);
      // Display the date as a string like "Oct 31"
      const key = moment(d).format("MMM D");
      if (streak[key] == null) {
        streak[key] = 0;
      }
      streak[key] += score.score;
    });
    return streak;
  },
  getCurrentStreak: function() {
    const streak = this.getStreak();
    const m = moment();
    const yesterday = moment().subtract(1, "day");
    let currentStreak = 0;
    for (let date in streak) {
      // If the last date you did something was today or yesterday, increment
      // the streak. We don't want to throw away the streak if you haven't
      // done anything *yet* today, so we check yseterday too.
      if (date === m.format("MMM D") ||
          (date === yesterday.format("MMM D") && currentStreak === 0)) {
        currentStreak++;
        m.subtract(1, "day");
      } else {
        break;
      }
    }
    return currentStreak;
  },
  render: function() {
    const {
      operation,
      points,
      showSettings,
      showStats,
      startGame,
      timeData,
      userName,
    } = this.props;
    const currentStreak = this.getCurrentStreak();

    return (
      <View style={styles.container}>

        <AppText style={[styles.headingText, styles.name]}>
          {'Hi '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {userName}
          </AppTextBold>
          {'!'}
        </AppText>

        <View style={styles.divider} />

        <AppText style={[styles.headingText, {paddingBottom: 0}]}>
          {'Points today: '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {this.getPointsToday()}
          </AppTextBold>
          {' / 500'}
        </AppText>

        <AppText style={[styles.headingText, styles.headingTextSmall]}>
          (You have {points} points in total)
        </AppText>

        <AppText style={[styles.headingText, {paddingBottom: 0}]}>
          {'Current streak: '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {currentStreak}
          </AppTextBold>
          {` day${currentStreak === 1 ? '' : 's'}`}
        </AppText>

        <AppText style={styles.headingText}>
          {'You\'re learning '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {operation}
          </AppTextBold>
          {'!'}
        </AppText>

        <View style={styles.divider} />

        <View style={styles.actions}>
          <View style={styles.action}>
            <View style={styles.gridWrapper}>
              <Grid
                small={true}
                timeData={timeData}
                operation={operation}
                onPress={showStats} />
            </View>
            <View>
              <AppTextBold style={styles.actionCaption}>
                My Progress
              </AppTextBold>
            </View>
          </View>

          <View style={styles.action}>
            <TouchableHighlight
              onPress={startGame}
              underlayColor='transparent'
              activeOpacity={0.5}
            >
              <View style={styles.action}>
                <Icon
                  type='play'
                  backgroundType='circle'
                  color={SH.colors.white}
                  backgroundColor={SH.colors.active}
                  size={90} />
                <View>
                  <AppTextBold
                    style={[
                      styles.actionCaption,
                      styles.actionCaptionLarge
                    ]}
                  >
                    PLAY!
                  </AppTextBold>
                </View>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.action}>
            <TouchableHighlight
              onPress={showSettings}
              underlayColor='transparent'
              activeOpacity={0.5}
            >
              <View style={styles.action}>
                <Icon
                  type='cog'
                  backgroundType='square'
                  backgroundColor={SH.colors.inactive}
                  color={SH.colors.grey68}
                  size={68} />
                <View>
                  <AppTextBold style={styles.actionCaption}>
                    Settings
                  </AppTextBold>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flex: 1,
    alignItems: 'center',
  },
  actionCaption: {
    color: SH.colors.grey68,
    fontSize: 12,
    lineHeight: 22,
  },
  actionCaptionLarge: {
    color: SH.colors.active,
    fontSize: 18,
    lineHeight: 26,
  },

  eggScene: {
    marginBottom: 20,
    marginTop: 20,
  },

  gridWrapper: {
    margin: 3,
  },

  headingText: {
    color: SH.colors.grey68,
    fontSize: 18,
    paddingBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
  },
  headingTextSmall: {
    fontSize: 16,
  },
  headingTextEmphasis: {
    color: SH.colors.grey25,
  },

  container: {
    backgroundColor: SH.colors.backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },

  divider: {
    backgroundColor: SH.colors.grey90,
    height: 1.5,
    marginBottom: 25,
    marginTop: 15,
  },

});

module.exports = HomeScreen;