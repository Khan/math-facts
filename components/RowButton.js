'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';
import Icon from '../components/Icon'

const Button = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    text: React.PropTypes.string,
  },
  render: function() {
    const {
      onPress,
      text,
    } = this.props;

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor='#ddd'
        style={styles.buttonWrapper}
        activeOpacity={0.5}
      >
        <View
          style={styles.button}>
          <AppText
              style={styles.buttonText}>
            {text}
          </AppText>
          <View style={styles.icon}>
            <Icon
              size={18}
              color='#999'
              type='angleBracketRight' />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
  },
  buttonText: {
    color: '#555',
    flex: 1,
    fontSize: 18,
  },
  buttonWrapper: {
    borderColor: '#d9d9d9',
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  icon: {
    paddingTop: 3,
  }
});

module.exports = Button;