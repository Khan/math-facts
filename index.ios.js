/**
 * Math Facts App
 */
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

var ReactNativeStore = require('react-native-store');

var Quizzer = require('./Quizzer.ios');
var Stats = require('./Stats.ios');

var Button = React.createClass({
  render: function() {
    var color = this.props.color ? this.props.color : '#89dacc';
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <View style={[styles.button, {backgroundColor: color}]}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var MathFacts = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      showStats: false,
      quizzesData: {},
      mode: 'multiplication'
    };
  },
  startGame: function() {
    this.setState({
      playing: true
    });
  },
  showStats: function() {
    this.updatequizzesData();
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
  updatequizzesData: function() {
    var quizzesData = {};
    ReactNativeStore.table("quizzes").then((quizzes) => {
      return quizzes.databaseData["quizzes"].rows;
    }).then((quizzesData) => {
      this.setState({
        quizzesData: quizzesData
      });
    });
  },
  finish: function(quizzesData) {
    this.setState({
      playing: false
    }, () => {
      ReactNativeStore.table("quizzes").then((quizzes) => {
        var id = quizzes.add({
          quizData: quizzesData
        });
      });
    });
  },
  componentDidMount: function() {
    this.updatequizzesData();
  },
  render: function() {
    var mode = this.state.mode;
    return (
      <View style={styles.appWrapper}>
        {this.state.playing &&
          <Quizzer
            mode={mode}
            back={this.showMenu}
            finish={this.finish}
            count={10}/>
        }
        {this.state.showStats &&
          <Stats
            mode={mode}
            back={this.showMenu}
            quizzesData={this.state.quizzesData}/>
        }
        {!this.state.playing && !this.state.showStats &&
          <View style={styles.container}>
            <Button text="Play" onPress={this.startGame} />
            <Button text="Stats" onPress={this.showStats} />
            <View style={styles.toggleButtons}>
              <Button
                text="Addition"
                color={mode == 'addition' ? "#666" : "#ccc"}
                onPress={() => {
                  this.setState({ mode: "addition" })}
                }/>
              <Button
                text="Multiplication"
                color={mode == 'multiplication' ? "#666" : "#ccc"}
                onPress={() => {
                  this.setState({ mode: "multiplication" })}
                }/>
            </View>
          </View>
        }
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

  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#89dacc",
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 30,
    color: "#fff"
  },

  toggleButtons: {
    flexDirection: 'row'
  }

});

AppRegistry.registerComponent('MathFacts', () => MathFacts);
