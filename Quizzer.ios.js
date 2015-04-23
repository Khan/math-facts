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
          margin: 5,
        }}
      />
    );
  }
});

var Quizzer = React.createClass({
  getInitialState: function() {
    return {
      type: 'add',
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
  hint: function() {
    this.setState({
      hintUsed: true
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
          count: this.state.count + 1,
          leftNumber: randomIntBetween(1, 10),
          rightNumber: randomIntBetween(1, 10),
          hintUsed: false,
          time: 0,
          data: data,
          response: '',
        });
      }
    }
  },

  _renderNumpad: function() {

    var button = (onPress, content) => {
      return (
        <TouchableHighlight
            key={'numpad-'+content}
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
    buttons.push(button(this.hint, '?'));

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
    var left = this.state.leftNumber;
    var right = this.state.rightNumber;
    var total = left + right;

    var num = 1;
    var hint = _.map(_.range(0, 2), (hint10) => {
      var backgroundColor = hint10 % 10 ? '#ddd' : '#ccc';
      return (
        <View
            style={[styles.hint10, {backgroundColor: backgroundColor}]}
            key={'hint10-' + hint10}>
        {_.map(_.range(0, 2), (hint5) => {
          return (
            <View
                style={styles.hint5}
                key={'hint5-' + hint5}>
            {_.map(_.range(0, 5), () => {
              var offset = hint10 * 10 + hint5 * 5;
              var round = hint5 === 0 ? Math.ceil : Math.floor;
              var showLeft = num - offset <= round((left - hint10 * 10)/2);
              var showRight = num - offset <= round((total - hint10 * 10)/2);

              var color = showLeft ? '#eb73a6' :
                          showRight ? '#878da7' :
                          '#eee';
              num++;
              return (
                <Circle
                  size={20}
                  color={color}
                  key={'circle-' + num}/>
            );
          })}
          </View>
          );
        })}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.back}>
          <Text>Back</Text>
        </TouchableHighlight>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            {left.toString() + ' + ' + right.toString()}
          </Text>
          <Text style={styles.response}>
            {this.state.response}
          </Text>
        </View>
        <View style={styles.hintContainer}>
          {this.state.hintUsed && <View style={styles.hint}>{hint}</View>}
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

  hintContainer: {
    flex: 0,
    height: 100,
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  hint: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  hint10: {
    flex: 0,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  hint5: {
    flex: 1,
    flexDirection: 'row'
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
