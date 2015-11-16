'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  StyleSheet,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText';

import MathFactsActions from '../actions/MathFactsActions';

import HomeScreen from '../components/HomeScreen';
import Quizzer from '../components/Quizzer';
import Stats from '../components/Stats';
import Settings from '../components/Settings';

if (React.StatusBarIOS) {
  React.StatusBarIOS.setHidden(true, 'slide');
}

const Navigation = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      showStats: false,
      showSettings: false,
    };
  },
  startGame: function() {
    this.setState({
      playing: true
    });
  },
  showStats: function() {
    this.setState({
      showStats: true
    });
  },
  showSettings: function() {
    this.setState({
      showSettings: true
    });
  },
  showMenu: function() {
    this.setState({
      playing: false,
      showStats: false,
      showSettings: false,
    });
  },
  finish: function(quizData, points, playAgain) {
    const operation = this.props.user.operation;

    _.each(quizData, (questionData) => {
      MathFactsActions.addAttempts(operation, [questionData]);
    });
    MathFactsActions.addPoints(points);

    this.setState({
      playing: false,
    }, () => {
      if (playAgain) {
        this.startGame();
      }
    });
  },
  playAgain: function(quizData, points) {
    this.finish(quizData, points, true);
  },
  componentDidMount: function() {
    MathFactsActions.initializeData();
  },
  setOperation: function(operation) {
    MathFactsActions.setOperation(operation);
  },
  setTime: function(time) {
    MathFactsActions.setTime(time);
  },
  parseQuizzesDataIntoTimeData: function(quizzesData) {
    return _.map(_.range(0, 12), (left) => {
      return _.map(_.range(0, 12), (right) => {
        if (quizzesData[left] != null && quizzesData[left][right] != null) {
          return quizzesData[left][right];
        }
        return [];
      });
    });
  },

  render: function() {

    if (!this.props.isLoaded) {
      return (
        <View style={styles.loadingScreen}>
          <AppText>Loading...</AppText>
        </View>
      );
    }

    const operation = this.props.user.operation;
    const quizzesData = this.props.factData[operation];
    const timeData = this.parseQuizzesDataIntoTimeData(quizzesData);

    if (this.state.playing) {
      return (
        <Quizzer
          operation={operation}
          back={this.showMenu}
          finish={this.finish}
          playAgain={this.playAgain}
          quizzesData={quizzesData}
          timeData={timeData}
          mode={'time'}
          seconds={this.props.user.time}
          count={10}
        />
      );
    }

    if (this.state.showStats) {
      return (
        <Stats
          operation={operation}
          goBack={this.showMenu}
          timeData={timeData}
        />
      );
    }

    if (this.state.showSettings) {
      return (
        <Settings
          addUser={MathFactsActions.addUser}
          changeActiveUser={MathFactsActions.changeActiveUser}
          changeUserName={MathFactsActions.changeName}
          goBack={this.showMenu}
          operation={this.props.user.operation}
          setOperation={this.setOperation}
          time={this.props.user.time}
          setTime={this.setTime}
          user={this.props.user}
          userList={this.props.userList}
          uuid={this.props.uuid}
        />
      );
    }

    return (
      <HomeScreen
        operation={operation}
        points={this.props.points}
        scores={this.props.scores}
        showSettings={this.showSettings}
        showStats={this.showStats}
        startGame={this.startGame}
        timeData={timeData}
        userName={this.props.user.name}
      />
    );
  }
});

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});

module.exports = Navigation;
