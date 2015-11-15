'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';
import Icon from './Icon';

const BackButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <TouchableHighlight
          underlayColor='transparent'
          activeOpacity={0.4}
          onPress={this.props.onPress}
          style={styles.backButton}>
        <View style={styles.buttonContents}>
          <View style={styles.icon}>
            <Icon
              color='rgba(0, 0, 0, 0.4)'
              size={30}
              type='angleBracketLeft'
            />
          </View>
          <AppText style={styles.backButtonText}>
            Back
          </AppText>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    padding: 15,
  },
  buttonContents: {
    flexDirection: 'row',
    marginTop: 3,
  },
  backButtonText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 20,
  },
  icon: {
    marginTop: 3,
  },
});

module.exports = BackButton;