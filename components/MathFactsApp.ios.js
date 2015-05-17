'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
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
      quizzesData: {
        store: MathFactsStore,
        fetch: (store) => {
          var allFacts = store.getAll();
          return allFacts;
        }
      },
      points: {
        store: MathFactsStore,
        fetch: (store) => {
          var points = store.getPoints();
          return points;
        }
      }
    })
  ],
  getInitialState: function() {
    return {
      playing: false,
      showStats: false,
      operation: 'addition'
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
  showMenu: function() {
    this.setState({
      playing: false,
      showStats: false,
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
    MathFactsActions.initializePoints();
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
            color={operation === 'addition' ? '#666' : '#ccc'}
            small={true}
            onPress={this.setAdditionoperation}/>
          <Button
            text='Multiplication'
            color={operation === 'multiplication' ? '#666' : '#ccc'}
            small={true}
            onPress={this.setMultiplicationoperation}/>
        </View>
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
        mode={'count'}
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
  render: function() {
    var content = this.state.playing   ? this._renderQuizzer() :
                  this.state.showStats ? this._renderStats() :
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

  points: {
    alignItems: 'center',
    marginTop: -20,
    paddingBottom: 20,
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