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

var Button = React.createClass({
  defaultProps: {
    small: React.PropTypes.bool,
    color: React.PropTypes.string,
    text: React.PropTypes.string,
    style: React.PropTypes.style
  },
  render: function() {
    var color = this.props.color ? this.props.color : '#89dacc';
    var style = this.props.style ? this.props.style : null;

    var buttonTextStyle = styles.buttonText;
    if (this.props.small) {
      buttonTextStyle = [buttonTextStyle, { fontSize: 16 }];
    }

    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor='transparent'
        activeOpacity={0.5}>
        <View style={[styles.button, { backgroundColor: color }, style]}>
          <AppText style={buttonTextStyle}>{this.props.text}</AppText>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
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