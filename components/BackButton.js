'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

const BackButton = React.createClass({
  propTypes: {
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

const styles = StyleSheet.create({
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