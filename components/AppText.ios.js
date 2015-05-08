'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;

var AppText = React.createClass({
  render: function() {
    var { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, style]}>
        {this.props.children}
      </Text>);
  }
});
var AppTextBold = React.createClass({
  render: function() {
    var { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, styles.boldText, style]}>
        {this.props.children}
      </Text>);
  }
});

var AppTextThin = React.createClass({
  render: function() {
    var { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, styles.thinText, style]}>
        {this.props.children}
      </Text>);
  }
});

var styles = StyleSheet.create({
  baseText: {
    fontFamily: 'AppleSDGothicNeo-Medium'
  },
  boldText: {
    fontFamily: 'AppleSDGothicNeo-SemiBold'
  },
  thinText: {
    fontFamily: 'AppleSDGothicNeo-Thin'
  },
});

module.exports = {
  AppText: AppText,
  AppTextBold: AppTextBold,
  AppTextThin: AppTextThin,
};