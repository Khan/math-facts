'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  TextInput,
  View,
} = React;

var { AppText, AppTextBold, AppTextThin } = require('./AppText.ios');

var MathFactsStore = require('../stores/MathFactsStore');
var MathFactsActions = require('../actions/MathFactsActions');

var StateFromStoreMixin = require('../lib/state-from-store-mixin.js');

var Quizzer = require('../components/Quizzer.ios');
var Stats = require('../components/Stats.ios');

var Button = require('../components/Button.ios');
var BackButton = require('../components/BackButton.ios');

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
        <Button
          text='Play'
          onPress={this.startGame} />
        <Button
          text='Progress'
          onPress={this.showStats} />
        <View style={styles.toggleButtons}>
          <Button
            text='Addition'
            color={operation === 'addition' ? null : '#ddd'}
            small={true}
            onPress={this.setAdditionoperation}/>
          <Button
            text='Multiplication'
            color={operation === 'multiplication' ? null : '#ddd'}
            small={true}
            onPress={this.setMultiplicationoperation}/>
        </View>
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
    return (
      <Quizzer
        operation={operation}
        back={this.showMenu}
        finish={this.finish}
        playAgain={this.playAgain}
        quizzesData={this.state.quizzesData[operation]}
        mode={'time'}
        seconds={20}
        count={10}/>
    );
  },
  _renderStats: function() {
    var operation = this.state.operation;
    return (
      <Stats
        operation={operation}
        back={this.showMenu}
        quizzesData={this.state.quizzesData[operation]}/>
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
    var userList = _.map(this.state.userList, (user) => {
      return (
        <Button
          text={user.name}
          small={true}
          onPress={() => {
            MathFactsActions.changeActiveUser(user.id);
          }}/>
      );
    });
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <BackButton onPress={this.showMenu} />
        </View>
        <View style={styles.content}>
          <View>
            <AppText>Users:</AppText>
            {userList}
          </View>
          <View>
            <AppText>Change Nickname</AppText>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              value={this.state.user.name}
              onSubmitEditing={(event) => {
                MathFactsActions.changeName(event.nativeEvent.text);
              }}
            />
          </View>
          <View>
            <AppText>Add User</AppText>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onSubmitEditing={(event) => {
                MathFactsActions.addUser(event.nativeEvent.text);
              }}
            />
          </View>
          <Button
            text='Clear data'
            onPress={MathFactsActions.clearData}
          />
        </View>
      </View>
    );
  },
  render: function() {
    var content = this.state.loaded       ? this._renderLoading() :
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
    backgroundColor: '#fafafa',
    paddingTop: 20
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
    justifyContent: 'center'
  }

});

module.exports = MathFactsApp;