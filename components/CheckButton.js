'use strict';

import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
} = React;

import { AppText, AppTextBold } from './AppText';
import Icon from '../components/Icon';
import MyTouchableHighlight from '../core-components/touchable-highlight';
import SH from '../helpers/style-helpers';
import { lineHeightUnits } from '../helpers/helpers';

const CheckButton = React.createClass({
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
      <MyTouchableHighlight
        onPress={onPress}
        underlayColor={SH.colors.grey85}
        style={styles.buttonWrapper}
        activeOpacity={0.8}
      >
        <View
          style={[styles.button, last && styles.lastButton]}>
          <View style={styles.icon}>
            <Icon
              backgroundColor={active ? SH.colors.active : SH.colors.inactive}
              backgroundType='circle'
              size={28}
              color={SH.colors.white}
              type={active ? 'check'  : 'none'} />
          </View>
          <AppText style={styles.buttonText}>
            {text}
          </AppText>
        </View>
      </MyTouchableHighlight>
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
    lineHeight: lineHeightUnits(26),
    paddingTop: 2,
  },
  buttonWrapper: {
  },
  icon: {
    marginRight: 20,
  }
});

module.exports = CheckButton;
