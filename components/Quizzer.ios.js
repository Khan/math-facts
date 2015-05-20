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

var ColorHelpers = require('../helpers/ColorHelpers.ios');
var MasteryHelpers = require('../helpers/MasteryHelpers.ios');
var OperationHelper = require('../helpers/OperationHelpers.ios');
var randomIntBetween = require('../helpers/Helpers.ios').randomIntBetween;

var NumPad = require('../components/NumPad.ios');
var AdditionHint = require('../components/AdditionHint.ios');
var Button = require('../components/Button.ios');
var Circle = require('../components/Circle.ios');

var BackButton = require('../components/BackButton.ios');

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
  defaultProps: {

  },
  getInitialState: function() {
    return {
      inputList: [],
      loaded: false,
      studyFact: [1, 1],

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
    this.setState({
      response: this.state.response + value.toString()
    }, this.check);
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
  makeInputList: function(quizzesData) {
    var operation = this.props.operation;

    // TODO: Move these to OperationHelper
    var min = 1;
    var max = 10;
    var easiestFacts = _.flatten(_.map(
        _.range(min, max - min + 2),
        (a) => _.map(
          _.range(min, a + 1),
          (b) => [a, b]
        )
      ), true);

    var questionSeeds = [];
    console.log('quizzesData', quizzesData)

    // Populate question seeder with data about facts that have already been
    // practiced
    _.each(_.range(0, max + 1), (row) => {
      questionSeeds[row] = [];
      if (quizzesData[row] == null) {
        quizzesData[row] = [];
      }
      _.each(_.range(0, max + 1), (col) => {
        var timeData = quizzesData[row][col];
        var answer = OperationHelper[operation].getAnswer([row, col]);
        var factStatus = MasteryHelpers.getFactStatus(answer, timeData);
        questionSeeds[row][col] = factStatus;
      });
    });

    console.log('questionSeeds', questionSeeds)

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

    var inputList = [];

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

    console.log('fluentFacts', fluentFacts)
    console.log('nonFluentFacts', nonFluentFacts)
    console.log('unknownFacts', unknownFacts)

    if (unknownFacts.length > 0) {
      // We don't have enough data about this user, so ask them unknown facts.
      // TODO: make sure there are enough facts for this quiz
      inputList = shuffle(unknownFacts);
    } else {
      // We know whether this user is fluent or not fluent in each fact.
      // We want to pick one struggling fact as the learning fact and use spaced
      // repetition to introduce it into long term memory.

      // TODO: this.
    }

    console.log('inputList', inputList)

    this.setState({
      inputList: inputList,
      loaded: true
    }, () => {
      this.interval = setInterval(this.countdown, 1000);
    });
  },
  componentDidMount: function() {
    if (this.props.quizzesData != null) {
      this.makeInputList(this.props.quizzesData);
    }
  },
  componentWillReceiveProps: function(newProps) {
    var oldQuizzesData = this.props.quizzesData;

    if (oldQuizzesData == null && newProps.quizzesData != null) {
      this.makeInputList(newProps.quizzesData);
    }
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  tick: function() {
    var timeLimit = this.props.seconds * 1000;
    var timesUp = this.state.totalTimeElapsed > timeLimit;
    if (this.props.mode === 'time' && timesUp) {
      clearInterval(this.interval);
    } else {
      this.setState({
        time: this.state.time + 50,
        totalTimeElapsed: this.state.totalTimeElapsed + 50
      });
    }
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
    var answer =  OperationHelper[this.props.operation].getAnswer(inputs);
    if (this.state.response === answer.toString()) {
      // Delay logic so user has a chance to see the digit they just entered
      var time = this.state.time;
      var hintUsed = this.state.hintUsed;
      // TODO: Change this to be based on the user's typing speed and the number
      // of digits in the answer
      var timeBonus = (time < 1000 ? 20 : time < 2000 ? 5 : 1);
      var newPoints = this.state.points + timeBonus;
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
          this.setState({
            finished: true
          });
        }
        // Load a new question
        this.setState({
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
      ColorHelpers.hslToRgb([0, 0.7, 0.6]), // red
      ColorHelpers.hslToRgb([0.06, 0.7, 0.6]), // orange
      ColorHelpers.hslToRgb([0.1, 0.75, 0.58]), // yellow
      ColorHelpers.hslToRgb([0.2, 0.5, 0.5]), // light green
      ColorHelpers.hslToRgb([0.35, 0.4, 0.55]), // green
      ColorHelpers.hslToRgb([0.45, 0.6, 0.5]), // teal
      ColorHelpers.hslToRgb([0.55, 0.5, 0.5]), // blue
      ColorHelpers.hslToRgb([0.7, 0.6, 0.65]), // purple
      ColorHelpers.hslToRgb([0.8, 0.6, 0.65]), // purple-pink
      ColorHelpers.hslToRgb([0.9, 0.6, 0.65]), // pink
    ];
    return colors[this.state.colorHue % colors.length];
  },

  _renderProgressBar: function() {
    return (
      <View style={styles.progressBar}>
        {_.map(_.range(0, this.props.seconds), (value) => {
          var opacity = value + 1 < this.state.totalTimeElapsed/1000 ? 1 : 0.2;
          var notchStyles = {
            backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')'
          };
          return (
            <View
              key={'notch-' + value}
              style={[styles.progressBarNotch, notchStyles]}>
            </View>
          );
        })
      }
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
    var total = OperationHelper[this.props.operation].getAnswer(inputs);

    var rgb = this.getColor();
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    var question = OperationHelper[this.props.operation].getQuestion(inputs);

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
          <AppText style={styles.response}>
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


  progress: {
    flexDirection: 'row'
  },


  progressBar: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  progressBarNotch: {
    flex: 1,
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
    margin: 10,
    color: '#fff'
  },
  response: {
    fontSize: 65,
    height: 80,
    color: '#fff',
    marginBottom: 5,
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
