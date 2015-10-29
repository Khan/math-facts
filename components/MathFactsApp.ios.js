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

import Quizzer from '../components/Quizzer.ios';
import Stats from '../components/Stats.ios';

import Grid from '../components/Grid.ios';

import Button from '../components/Button.ios';
import BackButton from '../components/BackButton.ios';

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
  setAdditionoperation: function() {
    this.setState({operation: 'addition'});
  },
  setMultiplicationoperation: function() {
    this.setState({operation: 'multiplication'});
  },
  _renderHomeScreen: function() {
    var operation = this.state.operation;
    var quizzesData = this.state.quizzesData[operation];

    return (
      <View style={styles.container}>
        <View style={styles.points}>
          <AppText style={styles.pointsText}>
            {'Hi '}
            <AppTextBold style={styles.pointsTextEmphasis}>
              {this.state.user.name}
            </AppTextBold>
            {'!'}
          </AppText>
        </View>
        <View style={styles.points}>
          <AppText style={styles.pointsText}>
            {'You have '}
            <AppTextBold style={styles.pointsTextEmphasis}>
              {this.state.points}
            </AppTextBold>
            {' points'}
          </AppText>
        </View>
        <View style={styles.gridWrapper}>
          {quizzesData && <Grid
            small={true}
            timeData={this.parseQuizzesDataIntoTimeData(quizzesData)}
            operation={operation}
            onPress={this.showStats} />}
          <View>
            <AppTextBold style={styles.gridCaption}>
              {operation.charAt(0).toUpperCase() + operation.slice(1)}
            </AppTextBold>
          </View>
        </View>
        <Button
          text='Play'
          color='#29abca'
          onPress={this.startGame} />
        <Button
          text='Settings'
          color='#bbb'
          small={true}
          onPress={this.showSettings}/>
      </View>
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
    var operation = this.state.operation;

    var userList = _.map(this.state.userList, (user) => {
      var activeStyles = this.state.user.id === user.id ?
                            styles.activeSettingsButton : '';
      return (
        <Button
          key={user.id}
          text={user.name}
          small={true}
          style={[styles.settingsButton, activeStyles]}
          onPress={() => {
            MathFactsActions.changeActiveUser(user.id);
          }}/>
      );
    });

    return (
      <ScrollView ref='scrollView' contentContainerStyle={styles.scrollView}>
        <View style={styles.topRow}>
          <BackButton onPress={this.showMenu} />
        </View>
        <View style={styles.content}>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Mode</AppText>
            <View style={styles.toggleButtons}>
              <Button
                text='Addition'
                color={operation === 'addition' ? null : '#ddd'}
                small={true}
                wrapperStyle={styles.toggleButtonWrapper}
                onPress={this.setAdditionoperation}/>
              <Button
                text='Multiplication'
                color={operation === 'multiplication' ? null : '#ddd'}
                small={true}
                wrapperStyle={styles.toggleButtonWrapper}
                onPress={this.setMultiplicationoperation}/>
            </View>
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Change User</AppText>
            {userList}
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Change Nickname</AppText>
            <TextInput
              autoCapitalize='words'
              returnKeyType='done'
              style={styles.input}
              value={this.state.user.name}
              onChangeText={(text) => {
                var user = _.clone(this.state.user);
                user.name = text;
                this.setState({
                  user: user
                });
              }}
              ref='input'
              onFocus={() => {
                this.refs.scrollView.scrollResponderScrollNativeHandleToKeyboard(
                  React.findNodeHandle(this.refs.input)
                );
              }}
              onSubmitEditing={(event) => {
                MathFactsActions.changeName(this.state.user.name);
              }}
            />
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Add New User</AppText>
            <TextInput
              autoCapitalize='words'
              returnKeyType='done'
              style={styles.input}
              onSubmitEditing={(event) => {
                MathFactsActions.addUser(event.nativeEvent.text);
              }}
            />
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.uuidText}>
              {this.state.uuid}
            </AppText>
          </View>
        </View>
      </ScrollView>
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

  container: {
    flex: 1,
    justifyContent: 'center'
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  content: {
    flex: 1
  },

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  gridWrapper: {
    alignItems: 'center',
    height: 200,
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

  toggleButtons: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  toggleButtonWrapper: {
    flex: 1
  },

  // Settings
  scrollView: {
    // Leave space for the keyboard
    paddingBottom: 270
  },
  settingsSection: {
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    margin: 10,
    marginTop: 0,
    fontSize: 20,
  },
  input: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center'
  },
  settingsButton: {
    borderColor: '#fff',
    borderWidth: 2,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 2,
    marginRight: 2,
    padding: 10,
  },
  activeSettingsButton: {
    borderColor: 'rgba(0, 0, 0, 0.5)'
  },
  uuidText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },

});

module.exports = MathFactsApp;
