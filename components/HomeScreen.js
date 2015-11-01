'use strict';

import _ from 'underscore';

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

const HomeScreen = React.createClass({
  propTypes: {
    operation: React.PropTypes.string.isRequired,
    points: React.PropTypes.number.isRequired,
    showSettings: React.PropTypes.func.isRequired,
    showStats: React.PropTypes.func.isRequired,
    startGame: React.PropTypes.func.isRequired,
    timeData: React.PropTypes.array,
    userName: React.PropTypes.string.isRequired,
  },
  render: function () {
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
        <View style={styles.points}>
          <AppText style={styles.pointsText}>
            {'Hi '}
            <AppTextBold style={styles.pointsTextEmphasis}>
              {userName}
            </AppTextBold>
            {'!'}
          </AppText>
        </View>

        <View style={styles.points}>
          <AppText style={styles.pointsText}>
            {'You have '}
            <AppTextBold style={styles.pointsTextEmphasis}>
              {points}
            </AppTextBold>
            {' points'}
          </AppText>
        </View>

        <View style={styles.eggScene}>
          <EggScene />
        </View>

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

  points: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  pointsText: {
    fontSize: 20,
    color: '#999'
  },
  pointsTextEmphasis: {
    color: '#555'
  },

  container: {
    flex: 1,
    justifyContent: 'center'
  },

});

module.exports = HomeScreen;