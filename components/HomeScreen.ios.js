'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import Grid from '../components/Grid.ios';

import EggScene from '../components/EggScene.ios'

import Button from '../components/Button.ios';
import BackButton from '../components/BackButton.ios';

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
        <View style={styles.gridWrapper}>
          {timeData && <Grid
            small={true}
            timeData={timeData}
            operation={operation}
            onPress={showStats} />}
          <View>
            <AppTextBold style={styles.gridCaption}>
              {operation.charAt(0).toUpperCase() + operation.slice(1)}
            </AppTextBold>
          </View>
        </View>
        <EggScene />
        <Button
          text='Play'
          onPress={startGame} />
        <Button
          text='Settings'
          color='#bbb'
          small={true}
          onPress={showSettings}/>
      </View>
    );
  },
});

const styles = StyleSheet.create({

  gridWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gridCaption: {
    color: '#999',
    fontSize: 16,
    lineHeight: 32,
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