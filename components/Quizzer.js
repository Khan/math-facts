'use strict';

import _ from 'underscore';

import React from 'react-native';
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

import ColorHelpers from '../helpers/color-helpers';
import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';
import { randomIntBetween } from '../helpers/helpers';

import NumPad from '../components/NumPad';
import AdditionHint from '../components/AdditionHint';
import Button from '../components/Button';
import Circle from '../components/Circle';

import BackButton from '../components/BackButton';

var QuizzerScreen = React.createClass({
  render: function() {
    var rgb = this.props.color;
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    return (
      <View style={[styles.container, {backgroundColor: mainColor}]}>
        <View style={styles.topRow}>
          <BackButton onPress={this.props.back} />
          {(this.props.points != null) && <View style={styles.points}>
            <AppText style={styles.pointsText}>
              {this.props.points + ' points'}
            </AppText>
          </View>}
        </View>
        {this.props.children}
      </View>
    );
  },
});

var Quizzer = React.createClass({
  propTypes: {

  },
  getInitialState: function() {
    return {
      inputList: [],
      loaded: false,

      studyFact: [],
      spacer: 1,

      countdown: 1,

      count: 0,
      hintUsed: false,
      time: 0,
      data: [],
      response: '',
      colorHue: 0,
      totalTimeElapsed: 0,
      points: 0,

    };
  },
  getInputs: function() {
    // Get the next question's inputs
    return this.state.inputList[this.state.count];
  },
  addDigit: function(value) {
    if (this.state.response.toString().length < 3) {
      var intResponse = parseInt(this.state.response + value.toString());
      this.setState({
        response: intResponse
      }, this.check);
    } else {
      // TODO: visual feedback that you're at the max number of digits
    }
  },
  clear: function() {
    this.setState({
      response: ''
    });
  },
  hint: function() {
    this.setState({
      hintUsed: true
    });
  },
  addToInputList: function(quizzesData) {
    var operation = this.props.operation;
    var OperationHelper = OperationHelpers[operation];

    var easiestFacts = OperationHelper.getEasiestFactOrder();
    var max = 10;

    var questionSeeds = [];

    var learnerTypingTimes = MasteryHelpers.getLearnerTypingTime(
      this.props.timeData,
      operation
    );

    // Populate question seeder with data about facts that have already been
    // practiced
    _.each(_.range(0, max + 1), (row) => {
      questionSeeds[row] = [];
      if (quizzesData[row] == null) {
        quizzesData[row] = [];
      }
      _.each(_.range(0, max + 1), (col) => {
        var timeData = quizzesData[row][col];
        var answer = OperationHelper.getAnswer([row, col]);
        var factStatus = MasteryHelpers.getFactStatus(answer, timeData,
          learnerTypingTimes);
        questionSeeds[row][col] = factStatus;
      });
    });

    var shuffle = function(arr) {
      // Modified from: http://stackoverflow.com/a/6274381
      for (var j, x, i = arr.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
      }
      return arr;
    };

    var softShuffle = function(arr, blockSize, offset) {
      // Takes an array and shuffles blocks of values so things don't move too
      // far from their original location.
      blockSize = blockSize || arr.length;
      offset = offset || 0;

      var newArr = [];
      for (var i = offset; i < arr.length; i += blockSize) {
        var arrayBlock = arr.slice(i, i + blockSize);
        var shuffledBlock = shuffle(arr.slice(i, i + blockSize));
        newArr = newArr.concat(shuffledBlock);
      }
      return newArr;
    };

    var inputList = this.state.inputList;

    var fluentFacts = [];
    var nonFluentFacts = [];
    var unknownFacts = [];

    var pushFact = function(fact) {
      var left = fact[0];
      var right = fact[1];
      var fluency = questionSeeds[left][right];
      if (fluency === 'mastered') {
        fluentFacts.push(fact);
      } else if (fluency === 'struggling') {
        nonFluentFacts.push(fact);
      } else {
        unknownFacts.push(fact);
      }
    };

    _.each(easiestFacts, (fact) => {
      pushFact(fact);
      if (fact[0] !== fact[1]) {
        // Include the flipped fact if it's distinct (e.g. 2 + 1 and 1 + 2)
        pushFact([fact[1], fact[0]]);
      }
    });

    // TODO: update quizzesData on the fly so we can have the most up-to-date
    // view of which facts are fluent/not

    // TODO: make sure there are enough facts for this quiz
    if (unknownFacts.length > 0) {
      // We don't have enough data about this user, so ask them unknown facts.
      if (unknownFacts.length < 10) {
        // If we have too few unknown facts, pad the questions with some facts
        // that we know are fluent, making sure that everything is shuffled.
        inputList = inputList.concat(shuffle(
          unknownFacts.concat(
            shuffle(fluentFacts).slice(0, 10 - unknownFacts.length)
        )));
      } else {
        // If we're pullling from pretty much all the facts, give the easier
        // facts first. The blockSize comes from figuring out approximately
        // where the facts go from being easy to hard.
        inputList = inputList.concat(softShuffle(unknownFacts, 60));
      }
    } else if (nonFluentFacts.length > 0) {
      // We know whether this learner is fluent or not fluent in each fact.
      // We want to pick one struggling fact as the learning fact and use
      // spaced repetition to introduce it into long term memory.

      // TODO: Check something to do with long term memory?

      var studyFact = this.state.studyFact;
      if (studyFact.length === 0) {
        // We get to choose the study fact! Pick the next easiest fact that we
        // don't know.
        studyFact = nonFluentFacts[0];
      }

      // We're introducing this fact via spaced repetition. This fact will be
      // mixed in with fluent facts in the following pattern:
      //    L F L F F L F F F L F F F F L F F F F F L F F F F F F L ...
      // to attempt to work the fact into long-term memory.

      var spacer = this.state.spacer;

      inputList = inputList.concat([studyFact])
                           .concat(shuffle(fluentFacts).slice(0, spacer));
      this.setState({
        spacer: spacer + 1
      });
    } else {
      // This learner is fluent in everything! Let them practice to their
      // heart's content.
      inputList = inputList.concat(shuffle(fluentFacts));
    }

    return inputList;
  },
  initializeInputList: function(quizzesData) {
    var inputList = this.addToInputList(quizzesData);

    this.setState({
      inputList: inputList,
      loaded: true
    }, () => {
      this.interval = setInterval(this.countdown, 1000);
    });
  },
  componentDidMount: function() {
    if (this.props.quizzesData != null) {
      this.initializeInputList(this.props.quizzesData);
    }
  },
  componentWillReceiveProps: function(newProps) {
    var oldQuizzesData = this.props.quizzesData;

    if (oldQuizzesData == null && newProps.quizzesData != null) {
      this.initializeInputList(newProps.quizzesData);
    }
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  tick: function() {
    var timeLimit = this.props.seconds * 1000;

    this.setState({
      time: this.state.time + 50,
      totalTimeElapsed: this.state.totalTimeElapsed + 50
    });
  },
  countdown: function() {
    var countdown = this.state.countdown;

    if (countdown < 0) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, 50);
    }

    this.setState({
      countdown: countdown - 1
    });
  },
  check: function() {
    var inputs = this.getInputs();
    var answer =  OperationHelpers[this.props.operation].getAnswer(inputs);
    if (parseInt(this.state.response) === parseInt(answer)) {
      var time = this.state.time;
      var hintUsed = this.state.hintUsed;

      // TODO: Change this to be based on the user's typing speed and the
      // number of digits in the answer
      var timeBonus = (time < 1000 ? 20 : time < 2000 ? 5 : 1);
      var newPoints = this.state.points + timeBonus;

      // Delay logic so user has a chance to see the digit they just entered
      setTimeout(() => {
        var data = _.clone(this.state.data);
        var d = new Date();
        data.push({
          inputs: inputs,
          data: {
            time: time, // time taken in ms
            hintUsed: hintUsed,
            date: d.getTime()
          }
        });

        var timesUp = this.state.totalTimeElapsed > this.props.seconds * 1000;
        var finished = this.props.mode === 'time' ? timesUp :
                       (this.state.count >= this.props.count - 1)
        if (finished) {
          // Finished the quiz
          clearInterval(this.interval);
        }

        var inputList = this.state.inputList;
        if (this.state.count >= inputList.length - 1) {
          inputList = this.addToInputList(this.props.quizzesData);
        }

        // Load a new question
        this.setState({
          inputList: inputList,

          count: this.state.count + 1,
          hintUsed: false,
          time: 0,
          data: data,
          response: '',
          colorHue: this.state.colorHue + 1,
          points: newPoints,
          finished: finished
        });
      }, 150);
    }
  },

  getColor: function() {
    var colors = [
      ColorHelpers.hslToRgb([0.35, 0.39, 0.46]), // green
      ColorHelpers.hslToRgb([0.41, 0.69, 0.38]), // green-teal
      ColorHelpers.hslToRgb([0.46, 1.00, 0.33]), // teal
      ColorHelpers.hslToRgb([0.50, 0.87, 0.34]), // teal-blue
      ColorHelpers.hslToRgb([0.54, 0.68, 0.46]), // blue
      ColorHelpers.hslToRgb([0.63, 0.63, 0.67]), // blue-purple
      ColorHelpers.hslToRgb([0.70, 0.75, 0.72]), // purple
      ColorHelpers.hslToRgb([0.80, 0.58, 0.64]), // purple-pink
      ColorHelpers.hslToRgb([0.90, 0.57, 0.63]), // pink
      ColorHelpers.hslToRgb([0.95, 0.58, 0.64]), // pink-red
      ColorHelpers.hslToRgb([0.00, 0.84, 0.66]), // red
      ColorHelpers.hslToRgb([0.03, 0.72, 0.61]), // red-orange
      ColorHelpers.hslToRgb([0.06, 0.69, 0.55]), // orange
      ColorHelpers.hslToRgb([0.08, 0.56, 0.51]), // orange-yellow
      ColorHelpers.hslToRgb([0.10, 0.68, 0.45]), // yellow
      ColorHelpers.hslToRgb([0.20, 0.73, 0.35]), // light green
      ColorHelpers.hslToRgb([0.30, 0.55, 0.42]), // light green-green
    ];
    return colors[this.state.colorHue % colors.length];
  },

  _renderProgressBar: function() {
    var elapsedSeconds = Math.ceil(this.state.totalTimeElapsed / 1000);
    var totalSeconds = this.props.seconds;
    if (elapsedSeconds > totalSeconds) {
      elapsedSeconds = totalSeconds;
    }
    return (
      <View style={styles.progressBar}>
        <View style={[styles.progressBarSegment, {
          flex: elapsedSeconds / totalSeconds,
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }]} />
        <View style={[styles.progressBarSegment, {
          flex: 1 - elapsedSeconds / totalSeconds,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }]} />
      </View>
    );
  },

  _renderProgressDots: function() {
    return (
      <View style={styles.progressDots}>
        {_.map(_.range(0, this.props.count), (value) => {
          var opacity = value < this.state.count ? 1 : 0.2;
          var color = 'rgba(255, 255, 255, ' + opacity + ')';
          return (
            <Circle
              key={'notch-' + value}
              size={7}
              color={color}>
            </Circle>
          );
        })
      }
      </View>
    );
  },

  _renderProgress: function() {
    return this.props.mode === 'time' ? this._renderProgressBar() :
                                        this._renderProgressDots();
  },

  _renderLoading: function() {

    return (
      <QuizzerScreen color={this.getColor()} back={this.props.back}>
        <View style={styles.loading}>
          <AppText style={styles.loadingText}>
            Loading...
          </AppText>
        </View>
      </QuizzerScreen>
    );
  },

  _renderCountdown: function() {
    var countdown = this.state.countdown;

    return (
      <QuizzerScreen color={this.getColor()} back={this.props.back}>
        {this._renderProgress()}
        <View style={styles.countdown}>
          <AppText style={styles.countdownText}>
            {countdown > 0 ? 'Ready?' : 'GO!'}
          </AppText>
        </View>
      </QuizzerScreen>
    );
  },

  _renderGame: function() {
    var inputs = this.getInputs();
    var total = OperationHelpers[this.props.operation].getAnswer(inputs);

    var rgb = this.getColor();
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    var question = OperationHelpers[this.props.operation].getQuestion(inputs);

    return (
      <QuizzerScreen
          color={this.getColor()}
          points={this.state.points}
          back={this.props.back}>
        {this._renderProgress()}
        <View style={styles.questionContainer}>
          <AppText style={styles.question}>
            {question}
          </AppText>
        </View>
        <View style={styles.responseContainer}>
          <AppText style={[styles.response]}>
            {this.state.response}
          </AppText>
        </View>
        <View style={styles.hintContainer}>
          {this.state.hintUsed &&
            <AdditionHint color={rgb} left={inputs[0]} right={inputs[1]} />
          }
        </View>

        <NumPad
          operation={this.props.operation}
          addDigit={this.addDigit}
          hint={this.hint}
          clear={this.clear}/>

      </QuizzerScreen>
    );
  },

  _renderSummary: function() {
    var rgb = this.getColor();
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    var finish = () => {
      this.props.finish(this.state.data, this.state.points);
    };
    var playAgain = () => {
      this.props.playAgain(this.state.data, this.state.points);
    };
    return (
      <QuizzerScreen
          color={this.getColor()}
          points={this.state.points}
          back={finish}>
        {this._renderProgress()}
        <View style={styles.summary}>
          <AppText style={styles.summaryTitle}>
            {this.props.mode === 'time' ? 'Time\'s up!' : 'You\'re done!'}
          </AppText>
          <AppText style={styles.summaryText}>
            {'You earned '}
          </AppText>
          <AppTextBold style={styles.summaryPoints}>
            {this.state.points}
          </AppTextBold>
          <AppText style={styles.summaryText}>
            {' points!'}
          </AppText>
        </View>
        <Button
          text='Play Again'
          color='rgba(0, 0, 0, 0.15)'
          onPress={playAgain}/>
        <Button
          text='Back'
          color='rgba(0, 0, 0, 0.15)'
          onPress={finish}/>
      </QuizzerScreen>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this._renderLoading();
    } else if (this.state.countdown >= 0) {
      return this._renderCountdown();
    } else if (!this.state.finished) {
      return this._renderGame();
    } else {
      return this._renderSummary();
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa'
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  },

  backButton: {
    flex: 0,
    padding: 15,
    alignSelf: 'flex-start'
  },
  backButtonText: {
    color: '#fff',
    fontSize: 30,
    height: 30,
    marginTop: -11
  },

  points: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 15
  },
  pointsText: {
    color: '#fff'
  },

  progressBar: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  progressBarSegment: {
    height: 7
  },

  progressDots: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    margin: 10
  },

  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  question: {
    fontSize: 40,
    color: '#fff'
  },
  responseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  response: {
    fontSize: 75,
    height: 90,
    color: '#fff',
    marginBottom: 50,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  loadingText: {
    fontSize: 30,
    color: '#fff'
  },

  countdown: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  countdownText: {
    fontSize: 60,
    color: '#fff'
  },

  summary: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  summaryTitle: {
    fontSize: 50,
    marginBottom: 20,
    color: '#fff'
  },
  summaryText: {
    fontSize: 25,
    color: '#fff'
  },
  summaryPoints: {
    fontSize: 40,
    color: '#fff'
  }
});

module.exports = Quizzer;
