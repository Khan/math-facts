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

var Circle = React.createClass({
  render: function() {
    var size = this.props.size || 20;
    var color = this.props.color || '#527fe4';
    return (
      <View
        style={{
          borderRadius: size / 2,
          backgroundColor: color,
          width: size,
          height: size,
          margin: 3,
        }}
      />
    );
  }
});

var QuizzerScreen = React.createClass({
  render: function() {
    var rgb = this.props.color;
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    return (
      <View style={[styles.container, {backgroundColor: mainColor}]}>
        <View style={styles.topRow}>
          <TouchableHighlight
              underlayColor='transparent'
              activeOpacity={0.4}
              onPress={this.props.back}
              style={styles.backButton}>
            <View>
              <AppText style={styles.backButtonText}>{'×'}</AppText>
            </View>
          </TouchableHighlight>
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
      questionSeed: [],
      loaded: false,
      studyFact: [1, 1],

      countdown: 3,

      count: 0,
      inputs: this.getInputs(),
      hintUsed: false,
      time: 0,
      data: [],
      response: '',
      colorHue: 0,
      totalTimeElapsed: 0,
      points: 0,

    };
  },
  generateInputs: function() {
    var operation = this.props.operation;

    if (operation === 'addition') {
      var easiestFacts = [
        // +1s
        [1, 1],
        [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1],

        // +0s
        [0, 0], [1, 0],
        [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],

        // +2s
        [2, 2],
        [1, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2],

        // 5 + smalls
        [5, 1], [5, 2], [5, 3], [5, 4],

        // little doubles
        [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],

        // 10+s
        [10, 10],
        [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9],

        // pairs that make 10
        [9, 1], [8, 2], [7, 3], [6, 4], [5, 5],

        // pairs that make 11
        [9, 2], [8, 3], [7, 4], [6, 5],

        // big doubles
        [6, 6], [7, 7], [8, 8], [9, 9], [10, 10],

        // 9+s
        [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],

        // leftovers
        [4, 3], [6, 3], // the little ones

        [8, 4], [8, 6], // even, even, even!
        [6, 7], [7, 8], // the weird ones
        [7, 5], [8, 5], // adding 5
      ];


      _.each(easiestFacts, (fact) => {
        var left = fact[0];
        var right = fact[1];

      });


      return [randomIntBetween(0, 6), randomIntBetween(0, 6)];

    } else if (operation === 'multiplication') {
      return [randomIntBetween(0, 6), randomIntBetween(0, 6)];
    } else {
      return [randomIntBetween(0, 10), randomIntBetween(0, 10)];
    }
  },
  getInputs: function() {
    // Get the next question's inputs
    return this.generateInputs();
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
  makeQuestionSeeds: function(quizzesData) {
    var questionSeeds = [];
    console.log('quizzesData', quizzesData)

    // Populate question seeder with data about facts that have already been
    // practiced
    _.each(quizzesData, (rowData, row) => {
      questionSeeds[row] = [];
      _.each(quizzesData, (timeData, col) => {
        _.each(timeData, (data) => {

        });
        questionSeeds[row][col] = 1;
      });
    });

    console.log('questionSeeds', questionSeeds)

    this.setState({
      questionSeeds: questionSeeds,
      loaded: true
    }, () => {
      this.interval = setInterval(this.countdown, 1000);
    });
  },
  componentDidMount: function() {
    if (this.props.quizzesData.length > 0) {
      this.makeQuestionSeeds(this.props.quizzesData);
    }
  },
  componentWillReceiveProps: function(newProps) {
    var oldQuizzesData = this.props.quizzesData;

    if (oldQuizzesData.length === 0 && newProps.quizzesData.length > 0) {
      this.makeQuestionSeeds(newProps.quizzesData);
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
      this.setState({
        finished: true
      });
    } else {
      this.setState({
        time: this.state.time + 50,
        totalTimeElapsed: this.state.totalTimeElapsed + 50
      });
    }
  },
  countdown: function() {
    var countdown = this.state.countdown;
    if (countdown === 0) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, 50);
    }

    this.setState({
      countdown: countdown - 1
    });
  },
  check: function() {
    var inputs = this.state.inputs;
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
            finished: true,
            data: data,
            points: newPoints
          });

        } else {
          // Load a new question
          this.setState({
            count: this.state.count + 1,
            inputs: this.getInputs(),
            hintUsed: false,
            time: 0,
            data: data,
            response: '',
            colorHue: this.state.colorHue + 1,
            points: newPoints,
          });
        }
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
    var progressBar = (
      <View style={styles.progressBar}>
        {_.map(_.range(0, this.props.seconds), (value) => {
          var opacity = value + 1 < this.state.totalTimeElapsed/1000 ? 1 : 0.2;
          var color = 'rgba(255, 255, 255, ' + opacity + ')';
          var notchStyles = {
            backgroundColor: color
          };
          return (
            <View
              key={'notch-' + value}
              style={[styles.progressBarNotch, notchStyles]}>
            </View>
          );
        })}
      </View>
    );
    return progressBar;
  },

  _renderLoading: function() {

    return (
      <QuizzerScreen color={this.getColor()} back={this.props.back}>
        <View>
          <Text>Loading</Text>
        </View>
      </QuizzerScreen>
    );
  },

  _renderCountdown: function() {
    var countdown = this.state.countdown;

    return (
      <QuizzerScreen color={this.getColor()} back={this.props.back}>
        <View>
          <Text>{countdown}</Text>
        </View>
      </QuizzerScreen>
    );
  },

  _renderGame: function() {
    var inputs = this.state.inputs;
    var total = OperationHelper[this.props.operation].getAnswer(inputs);

    var rgb = this.getColor();
    var mainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    var progress = (
      <View style={styles.progress}>
        {_.map(_.range(0, this.props.count), (value) => {
          var opacity = value < this.state.count ? 1 : 0.2;
          var color = 'rgba(255, 255, 255, ' + opacity + ')';
          return (<Circle size={8} key={'circle-' + value} color={color}/>);
        })}
      </View>
    );

    var question = OperationHelper[this.props.operation].getQuestion(inputs);

    return (
      <QuizzerScreen
          color={this.getColor()}
          points={this.state.points}
          back={this.props.back}>
        {this._renderProgressBar()}
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

    return (
      <QuizzerScreen
          color={this.getColor()}
          points={this.state.points}
          back={() => {
            this.props.finish(this.state.data, this.state.points);
          }}>
        <View>
          <Text>Finished!</Text>
        </View>
      </QuizzerScreen>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this._renderLoading();
    } else if (this.state.countdown > 0) {
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
    alignItems: 'center',
    backgroundColor: '#fafafa',
    justifyContent: 'space-between'
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
});

module.exports = Quizzer;
