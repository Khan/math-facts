'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import MathFactsStore from '../stores/MathFactsStore';
import MathFactsActions from '../actions/MathFactsActions';

import StateFromStoreMixin from '../lib/state-from-store-mixin.js';

import HomeScreen from '../components/HomeScreen.ios';
import Quizzer from '../components/Quizzer.ios';
import Stats from '../components/Stats.ios';
import Settings from '../components/Settings.ios';

if (React.StatusBarIOS) {
  React.StatusBarIOS.setHidden(true, 'slide');
}

var MathFactsApp = React.createClass({
  mixins: [
    StateFromStoreMixin({
      loaded: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.isLoaded();
        }
      },
      quizzesData: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getAll();
        }
      },
      points: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getPoints();
        }
      },
      scores: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getScores();
        }
      },
      uuid: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getUuid();
        }
      },
      user: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getUser();
        }
      },
      userList: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getUserList();
        }
      }
    })
  ],
  getInitialState: function() {
    return {
      playing: false,
      showStats: false,
      showSettings: false,
      operation: 'multiplication'
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
    playAgain = playAgain ? playAgain : false;
    var operation = this.state.operation;
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
  addFactAttempt: function() {
    var newData = _.clone(this.state.data);

  },
  componentDidMount: function() {
    MathFactsActions.initializeData();
  },
  setOperation: function(operation) {
    this.setState({operation: operation});
  },
  _renderHomeScreen: function() {
    const operation = this.state.operation;
    const quizzesData = this.state.quizzesData[operation];
    const timeData = quizzesData ?
      this.parseQuizzesDataIntoTimeData(quizzesData) : null;

    return (
      <HomeScreen
        operation={operation}
        points={this.state.points}
        showSettings={this.showSettings}
        showStats={this.showStats}
        startGame={this.startGame}
        timeData={timeData}
        userName={this.state.user.name}
      />
    );
  },
  _renderQuizzer: function() {
    var operation = this.state.operation;
    var quizzesData = this.state.quizzesData;
    return (
      <Quizzer
        operation={operation}
        back={this.showMenu}
        finish={this.finish}
        playAgain={this.playAgain}
        quizzesData={quizzesData[operation]}
        timeData={this.parseQuizzesDataIntoTimeData(quizzesData[operation])}
        mode={'time'}
        seconds={60}
        count={10}/>
    );
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
  _renderStats: function() {
    var operation = this.state.operation;
    var quizzesData = this.state.quizzesData[operation];

    // Size must be larger than the max size of the values that are added
    var timeData = this.parseQuizzesDataIntoTimeData(quizzesData);

    return (
      <Stats
        operation={operation}
        back={this.showMenu}
        timeData={timeData}/>
    );
  },
  _renderLoading: function() {
    return (
      <View style={styles.loadingScreen}>
        <AppText>Loading...</AppText>
      </View>
    );
  },
  _renderSettings: function() {
    return (
      <Settings
        addUser={MathFactsActions.addUser}
        changeActiveUser={MathFactsActions.changeActiveUser}
        changeUserName={MathFactsActions.changeName}
        goBack={this.showMenu}
        operation={this.state.operation}
        setOperation={this.setOperation}
        user={this.state.user}
        userList={this.state.userList}
        uuid={this.state.uuid} />
    );
  },
  render: function() {
    var content = !this.state.loaded       ? this._renderLoading() :
                   this.state.playing      ? this._renderQuizzer() :
                   this.state.showStats    ? this._renderStats() :
                   this.state.showSettings ? this._renderSettings() :
                                            this._renderHomeScreen();
    return (
      <View style={styles.appWrapper}>
        {content}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: '#fafafa'
  },

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});

module.exports = MathFactsApp;
