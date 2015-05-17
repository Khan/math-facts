'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

var { AppText, AppTextBold, AppTextThin } = require('./AppText.ios');

var BackButton = React.createClass({
  defaultProps: {
    onPress: React.PropTypes.func
  },
  render: function() {
    return (
      <TouchableHighlight
          underlayColor='transparent'
          activeOpacity={0.4}
          onPress={this.props.onPress}
          style={styles.backButton}>
        <View>
          <AppText style={styles.backButtonText}>{'×'}</AppText>
        </View>
      </TouchableHighlight>
    );
  }
});


var styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    padding: 15
  },
  backButtonText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 30,
    height: 30,
    marginTop: -11
  },
});

module.exports = BackButton;