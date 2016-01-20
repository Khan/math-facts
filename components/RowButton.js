'use strict';

import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
} = React;

import { AppText } from './AppText';
import Icon from '../components/Icon'
import MyTouchableHighlight from '../core-components/touchable-highlight';
import SH from '../helpers/style-helpers';

const RowButton = React.createClass({
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
      <MyTouchableHighlight
        onPress={onPress}
        underlayColor={SH.colors.grey90}
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
              color={SH.colors.grey68}
              type='angleBracketRight' />
          </View>
        </View>
      </MyTouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    backgroundColor: SH.colors.white,
    borderColor: SH.colors.grey75,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
  },
  buttonText: {
    color: SH.colors.grey25,
    flex: 1,
    fontSize: 18,
  },
  buttonWrapper: {
    marginBottom: 20,
  },
  icon: {
    paddingTop: 3,
  }
});

module.exports = RowButton;
