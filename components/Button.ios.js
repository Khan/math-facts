'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

const Button = React.createClass({
  defaultProps: {
    small: React.PropTypes.bool,
    color: React.PropTypes.string,
    text: React.PropTypes.string,
    style: React.PropTypes.style,
    wrapperStyle: React.PropTypes.style,
  },
  render: function() {
    const color = this.props.color ? this.props.color : '#29abca';
    const style = this.props.style ? this.props.style : null;
    const wrapperStyle = this.props.wrapperStyle ? this.props.wrapperStyle : null;

    let buttonTextStyle = styles.buttonText;
    if (this.props.small) {
      buttonTextStyle = [buttonTextStyle, { fontSize: 16 }];
    }

    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor='transparent'
        style={wrapperStyle}
        activeOpacity={0.5}>
        <View style={[styles.button, { backgroundColor: color }, style]}>
          <AppText style={buttonTextStyle}>{this.props.text}</AppText>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#89dacc',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff'
  },

  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  }

});

module.exports = Button;