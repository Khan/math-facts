'use strict';

import React from 'react-native';
const {
  StyleSheet,
  Text,
} = React;

const AppText = React.createClass({
  render: function() {
    const { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, style]}>
        {this.props.children}
      </Text>);
  }
});
const AppTextBold = React.createClass({
  render: function() {
    const { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, styles.boldText, style]}>
        {this.props.children}
      </Text>);
  }
});

const AppTextThin = React.createClass({
  render: function() {
    const { style, ...other } = this.props;
    return (
      <Text {...other} style={[styles.baseText, styles.thinText, style]}>
        {this.props.children}
      </Text>);
  }
});

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Avenir-Medium'
  },
  boldText: {
    fontFamily: 'Avenir-Heavy'
  },
  thinText: {
    fontFamily: 'Avenir-Thin'
  },
});

module.exports = {
  AppText: AppText,
  AppTextBold: AppTextBold,
  AppTextThin: AppTextThin,
};