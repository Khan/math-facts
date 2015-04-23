'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

var randomIntBetween = function(min, max) {
  return Math.floor(Math.random()*(max - min + 1)) + min;
};

var Quizzer = React.createClass({
  getInitialState: function() {
    return {
      type: "add",
      count: 0,
      leftNumber: randomIntBetween(1, 10),
      rightNumber: randomIntBetween(1, 10),
      hintUsed: false,
      time: 0,
      data: [],
      response: ''
    };
  },
  addDigit: function(value) {
    this.setState({
      response: this.state.response + value.toString()
    }, this.check);
  },
  backspace: function() {
    this.setState({
      response: this.state.response.slice(0, -1)
    });
  },
  check: function() {
    var answer = this.state.leftNumber + this.state.rightNumber;
    if (this.state.response === answer.toString()) {
      var data = _.clone(this.state.data);
      data.push({
        left: this.state.leftNumber,
        right: this.state.rightNumber,
        type: this.state.type,
        time: this.state.time, // time taken in ms
        hintUsed: this.state.hintUsed
      });

      if (this.state.count >= this.props.count - 1) {
        // Finished the quiz
        this.setState({
          data: data
        }, () => {
          this.props.finish(this.state.data);
        });

      } else {
        // Load a new question
        this.setState({
          leftNumber: randomIntBetween(1, 10),
          rightNumber: randomIntBetween(1, 10),
          response: '',
          count: this.state.count + 1,
          data: data
        });
      }
    }
  },

  _renderNumpad: function() {

    var button = (onPress, content) => {
      return (
        <TouchableHighlight
            key={"numpad-"+content}
            style={styles.button}
            onPress={onPress}
            underlayColor='transparent'
            activeOpacity={0.5}>
          <Text style={styles.buttonText}>
            {content}
          </Text>
        </TouchableHighlight>
      );
    }

    var buttons = _.map(_.range(1, 10), (value, index) => {
      return button(() => {this.addDigit(value)}, value);
    });

    buttons.push(button(this.backspace, '<-'));
    buttons.push(button(() => {this.addDigit(0)}, '0'));
    buttons.push(button(this.backspace, '?'));

    return (
      <View style={styles.buttons}>
        <View style={styles.buttonRow}>
          {buttons.slice(0, 3)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(3, 6)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(6, 9)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(9, 12)}
        </View>
      </View>
    );
  },

  render: function() {
    var leftNumber = this.state.leftNumber;
    var rightNumber = this.state.rightNumber;


    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.back}>
          <Text>Back</Text>
        </TouchableHighlight>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            {leftNumber.toString() + ' + ' + rightNumber.toString()}
          </Text>
          <Text style={styles.response}>
            {this.state.response}
          </Text>
        </View>

        {this._renderNumpad()}

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    justifyContent: 'space-between'
  },

  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  question: {
    fontSize: 40,
    margin: 10,
  },
  response: {
    fontSize: 60,
    height: 60,
    color: '#333333',
    marginBottom: 5,
  },

  buttons: {
    flex: 0,
    alignSelf: 'stretch',
    backgroundColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    backgroundColor: '#ddd',
    flexDirection: 'column',
    height: 60,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
  }
});

module.exports = Quizzer;
