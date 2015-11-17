'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

import ColorHelpers from '../helpers/color-helpers';
import MasteryHelpers from '../helpers/mastery-helpers';
import OperationHelpers from '../helpers/operation-helpers';
import Helpers from '../helpers/helpers';

import NumPad from '../components/NumPad';
import AdditionHint from '../components/AdditionHint';
import Button from '../components/Button';
import Circle from '../components/Circle';

import BackButton from '../components/BackButton';

const QuizzerScreen = React.createClass({
  propTypes: {
    color: React.PropTypes.arrayOf(React.PropTypes.number),
    points: React.PropTypes.number,
  },
  render: function() {
    const {
      color,
      points,
      children,
    } = this.props;
    const rgb = color;
    const mainColor = ColorHelpers.printRgb(rgb);

    return (
      <View style={[styles.container, {backgroundColor: mainColor}]}>
        <View style={styles.topRow}>
          <BackButton onPress={this.props.back} />
          {points != null && <View style={styles.points}>
            <AppText style={styles.pointsText}>
              {`${points} points`}
            </AppText>
          </View>}
        </View>
        {children}
      </View>
    );
  },
});

const Quizzer = React.createClass({
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
      const intResponse = parseInt(this.state.response + value.toString());
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
    const operation = this.props.operation;
    const OperationHelper = OperationHelpers[operation];

    const easiestFacts = OperationHelper.getEasiestFactOrder();
    const max = 10;

    const questionSeeds = [];

    const learnerTypingTimes = MasteryHelpers.getLearnerTypingTimes(
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
        const timeData = quizzesData[row][col];
        const answer = OperationHelper.getAnswer([row, col]);
        const factStatus = MasteryHelpers.getFactStatus(answer, timeData,
          learnerTypingTimes);
        questionSeeds[row][col] = factStatus;
      });
    });

    let inputList = this.state.inputList.slice();

    const fluentFacts = [];
    const nonFluentFacts = [];
    const unknownFacts = [];

    const pushFact = function(fact) {
      const left = fact[0];
      const right = fact[1];
      const fluency = questionSeeds[left][right];
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
        inputList = inputList.concat(Helpers.shuffle(
          unknownFacts.concat(
            Helpers.shuffle(fluentFacts).slice(0, 10 - unknownFacts.length)
        )));
      } else {
        // If we're pullling from pretty much all the facts, give the easier
        // facts first. The blockSize comes from figuring out approximately
        // where the facts go from being easy to hard.
        inputList = inputList.concat(Helpers.softShuffle(unknownFacts, 60));
      }
    } else if (nonFluentFacts.length > 0) {
      // We know whether this learner is fluent or not fluent in each fact.
      // We want to pick one struggling fact as the learning fact and use
      // spaced repetition to introduce it into long term memory.

      // TODO: Check something to do with long term memory?

      let studyFact = this.state.studyFact;
      if (studyFact.length === 0) {
        // We get to choose the study fact! Pick the next easiest fact that we
        // don't know.
        studyFact = nonFluentFacts[0];
      }

      // We're introducing this fact via spaced repetition. This fact will be
      // mixed in with fluent facts in the following pattern:
      //    L F L F F L F F F L F F F F L F F F F F L F F F F F F L ...
      // to attempt to work the fact into long-term memory.

      const spacer = this.state.spacer;

      inputList = inputList.concat([studyFact])
        .concat(Helpers.shuffle(fluentFacts).slice(0, spacer));
      this.setState({
        spacer: spacer + 1
      });
    } else {
      // This learner is fluent in everything! Let them practice to their
      // heart's content.
      inputList = inputList.concat(Helpers.shuffle(fluentFacts));
    }

    return inputList;
  },
  initializeInputList: function(quizzesData) {
    const inputList = this.addToInputList(quizzesData);

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
    const oldQuizzesData = this.props.quizzesData;

    if (oldQuizzesData == null && newProps.quizzesData != null) {
      this.initializeInputList(newProps.quizzesData);
    }
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  tick: function() {
    const timeLimit = this.props.seconds * 1000;

    this.setState({
      time: this.state.time + 50,
      totalTimeElapsed: this.state.totalTimeElapsed + 50
    });
  },
  countdown: function() {
    const countdown = this.state.countdown;

    if (countdown < 0) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, 50);
    }

    this.setState({
      countdown: countdown - 1
    });
  },
  check: function() {
    const inputs = this.getInputs();
    const operation = this.props.operation;
    const OperationHelper = OperationHelpers[operation];
    const answer = OperationHelper.getAnswer(inputs);

    if (parseInt(this.state.response) === parseInt(answer)) {
      const time = this.state.time;
      const hintUsed = this.state.hintUsed;

      const learnerTypingTimes = MasteryHelpers.getLearnerTypingTimes(
        this.props.timeData,
        operation
      );

      const timeBonus = MasteryHelpers.getTimeBonus(
        time,
        answer,
        learnerTypingTimes,
      );
      const newPoints = this.state.points + timeBonus;

      // Delay logic so user has a chance to see the digit they just entered
      setTimeout(() => {
        const data = _.clone(this.state.data);
        const d = new Date();
        data.push({
          inputs: inputs,
          data: {
            time: time, // time taken in ms
            hintUsed: hintUsed,
            date: d.getTime()
          }
        });

        const timesUp = this.state.totalTimeElapsed > this.props.seconds * 1000;
        const finished = this.props.mode === 'time' ? timesUp :
                       (this.state.count >= this.props.count - 1)
        if (finished) {
          // Finished the quiz
          clearInterval(this.interval);
        }

        let inputList = this.state.inputList;
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
    const colors = ColorHelpers.backgroundColors;
    return colors[this.state.colorHue % colors.length];
  },

  _renderProgressBar: function() {
    let elapsedSeconds = Math.ceil(this.state.totalTimeElapsed / 1000);
    const totalSeconds = this.props.seconds;
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
          const opacity = value < this.state.count ? 1 : 0.2;
          const color = 'rgba(255, 255, 255, ' + opacity + ')';
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
    const countdown = this.state.countdown;

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
    const inputs = this.getInputs();
    const total = OperationHelpers[this.props.operation].getAnswer(inputs);

    const rgb = this.getColor();
    const mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    const question = OperationHelpers[this.props.operation].getQuestion(inputs);

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
    const rgb = this.getColor();
    const mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    const finish = () => {
      this.props.finish(this.state.data, this.state.points);
    };
    const playAgain = () => {
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

const styles = StyleSheet.create({
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
