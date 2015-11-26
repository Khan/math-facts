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
    active: React.PropTypes.bool,
    last: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
    text: React.PropTypes.string,
  },
  render: function() {
    const {
      active,
      last,
      onPress,
      text,
    } = this.props;

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor='#ddd'
        style={styles.buttonWrapper}
        activeOpacity={0.8}
      >
        <View
          style={[styles.button, last && styles.lastButton]}>
          <View style={styles.icon}>
            <Icon
              backgroundColor={active ? '#29abca' : '#eee'}
              backgroundType='circle'
              size={28}
              color={active ? '#fff' : '#999'}
              type={active ? 'check'  : 'none'} />
          </View>
          <AppText style={styles.buttonText}>
            {text}
          </AppText>
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
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
  },
  lastButton: {
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  buttonText: {
    color: '#555',
    flex: 1,
    fontSize: 18,
    paddingTop: 2,
  },
  buttonWrapper: {
  },
  icon: {
    marginRight: 20,
  }
});

module.exports = Button;