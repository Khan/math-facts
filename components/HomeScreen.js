'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  PixelRatio,
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
    let pointsToday = 0;
    const d = new Date();
    const now = d.getTime();
    const oneDay = 60*60*24*1000;
    scores.forEach((score) => {
      if (score.date && score.date > now - oneDay) {
        pointsToday += score.score;
      }
    });
    return pointsToday;
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

    return (
      <View style={styles.container}>

        <AppText style={styles.headingText}>
          {'Hi '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {userName}
          </AppTextBold>
          {'!!!'}
        </AppText>

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
                  color='#fff'
                  backgroundColor='#29abca'
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
                  backgroundColor='#eee'
                  color='#bbb'
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
    color: '#999',
    fontSize: 12,
    lineHeight: 22,
  },
  actionCaptionLarge: {
    color: '#29abca',
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
    color: '#999',
    fontSize: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  headingTextSmall: {
    fontSize: 16,
  },
  headingTextEmphasis: {
    color: '#555'
  },

  container: {
    flex: 1,
    justifyContent: 'center'
  },

  divider: {
    backgroundColor: '#eee',
    height: 3 / PixelRatio.get(),
    marginBottom: 25,
    marginTop: 20,
  },

});

module.exports = HomeScreen;