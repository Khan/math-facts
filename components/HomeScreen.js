'use strict';

import _ from 'underscore';
import moment from 'moment';
import React from 'react-native';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import MyTouchableHighlight from '../core-components/touchable-highlight';

import { AppText, AppTextBold } from './AppText';

import Grid from '../components/Grid';
import OperationHelpers from '../helpers/operation-helpers';

import EggScene from '../components/EggScene';
import Icon from '../components/Icon';

import Button from '../components/Button';
import BackButton from '../components/BackButton';
import SH from '../helpers/style-helpers';
import { lineHeightUnits } from '../helpers/helpers';

const HomeScreenButton = React.createClass({
  propTypes: {
    caption: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    large: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
  },
  render: function() {
    const {
      caption,
      large,
      onPress,
    } = this.props;

    return <View style={styles.action}>
      <MyTouchableHighlight
        onPress={onPress}
        activeOpacity={0.5}a
        underlayColor='transparent'
      >
        <View style={styles.action}>
          {this.props.children}
          <View>
            <AppTextBold
              style={[
                styles.actionCaption,
                large && styles.actionCaptionLarge
              ]}
            >
              {caption}
            </AppTextBold>
          </View>
        </View>
      </MyTouchableHighlight>
    </View>;
  },
});

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
      // done anything *yet* today, so we check yesterday too, and if you did
      // something yesterday we start counting there.
      if (date === yesterday.format("MMM D") && currentStreak === 0) {
        m.subtract(1, "day");
      }
      if (date === m.format("MMM D")) {
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

    const showGrid = OperationHelpers[operation].showGrid;

    return (
      <View style={styles.container}>

        <View style={styles.section}>
          <AppText style={[styles.headingText, styles.name]}>
            {'Hi '}
            <AppTextBold style={styles.headingTextEmphasis}>
              {userName}
            </AppTextBold>
            {'!'}
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.innerSection}>
          <AppText style={[styles.headingText, {paddingBottom: 0}]}>
            {'Points today: '}
            <AppTextBold style={styles.headingTextEmphasis}>
              {this.getPointsToday()}
            </AppTextBold>
          </AppText>

          <AppText style={[styles.headingText, styles.headingTextSmall]}>
            (You have {points} points in total)
          </AppText>
        </View>

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
          <HomeScreenButton caption="My Progress" onPress={showStats}>
            {showGrid && <View style={styles.gridWrapper}>
              <Grid
                small={true}
                timeData={timeData}
                operation={operation}
              />
            </View>}
          </HomeScreenButton>

          <HomeScreenButton caption="PLAY!" large={true} onPress={startGame}>
            <Icon
              type='play'
              backgroundType='circle'
              color={SH.colors.white}
              backgroundColor={SH.colors.active}
              size={90}
            />
          </HomeScreenButton>

          <HomeScreenButton caption="Settings" onPress={showSettings}>
            <Icon
              type='cog'
              backgroundType='square'
              backgroundColor={SH.colors.inactive}
              color={SH.colors.grey68}
              size={68}
            />
          </HomeScreenButton>
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
    lineHeight: lineHeightUnits(18),
  },
  actionCaptionLarge: {
    color: SH.colors.active,
    fontSize: 18,
    lineHeight: lineHeightUnits(30),
  },

  eggScene: {
    marginBottom: 20,
    marginTop: 20,
  },

  gridWrapper: {
    margin: 3,
  },

  section: {
    paddingLeft: 20,
    paddingRight: 20,
  },

  innerSection: {
    paddingBottom: 10,
  },

  headingText: {
    color: SH.colors.grey68,
    fontSize: 18,
    lineHeight: lineHeightUnits(26),
    paddingTop: 0,
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