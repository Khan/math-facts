'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  Navigator,
  StyleSheet,
  View,
} from 'react-native';

import { AppText, AppTextBold } from './AppText';

import MathFactsActions from '../actions/MathFactsActions';

import HomeScreen from '../components/HomeScreen';
import { Platform } from '../helpers/helpers';
import Quizzer from '../components/Quizzer';
import Stats from '../components/Stats';
import Settings from '../components/Settings';
import SH from '../helpers/style-helpers';

if (React.StatusBarIOS) {
  React.StatusBarIOS.setHidden(true, 'slide');
}

const Navigation = React.createClass({
  finish: function(quizData, points) {
    const {
      operation,
      time,
    } = this.props.user;

    _.each(quizData, (questionData) => {
      MathFactsActions.addAttempts(operation, [questionData]);
    });
    MathFactsActions.addPoints(points, time, operation);
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

    if (Platform.OS === 'web') {
      return <HomeScreen

        operation={operation}
        points={this.props.points}
        scores={this.props.scores}
        showSettings={() => null}
        showStats={() => null}
        startGame={() => null}
        timeData={timeData}
        userName={this.props.user.name}
      />;
    }

    const initialRoute = {name: 'home'};
    return <Navigator
      initialRoute={initialRoute}
      renderScene={(route, navigator) => {
        if (route.name === 'home') {
          return <HomeScreen
            navigator={navigator}

            operation={operation}
            points={this.props.points}
            scores={this.props.scores}
            showSettings={() => {
              navigator.push({
                name: 'settings',
              })
            }}
            showStats={() => {
              navigator.push({
                name: 'stats',
              })
            }}
            startGame={() => {
              navigator.push({
                name: 'game',
              })
            }}
            timeData={timeData}
            userName={this.props.user.name}
          />;
        } else if (route.name === 'settings') {
          return <Settings
            navigator={navigator}

            addUser={MathFactsActions.addUser}
            changeActiveUser={MathFactsActions.changeActiveUser}
            changeUserName={MathFactsActions.changeName}
            goBack={navigator.popToTop}
            operation={this.props.user.operation}
            setOperation={this.setOperation}
            time={this.props.user.time}
            setTime={this.setTime}
            user={this.props.user}
            userList={this.props.userList}
            uuid={this.props.uuid}
          />;
        } else if (route.name === 'game') {
          return <Quizzer
            navigator={navigator}

            operation={operation}
            back={navigator.popToTop}
            finish={(quizData, points) => {
              this.finish(quizData, points);
              navigator.popToTop();
            }}
            playAgain={(quizData, points) => {
              this.finish(quizData, points);
              navigator.push({
                name: 'game',
              });
            }}
            quizzesData={quizzesData}
            timeData={timeData}
            mode={'time'}
            seconds={this.props.user.time}
            count={10}
          />
        } else if (route.name === 'stats') {
          return <Stats
            navigator={navigator}

            operation={operation}
            goBack={navigator.popToTop}
            timeData={timeData}
          />;
        }
      }}
    />

  }
});

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: SH.colors.backgroundColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

module.exports = Navigation;
