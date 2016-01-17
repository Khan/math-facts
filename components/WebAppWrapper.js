'use strict';

import React from 'react-native';
import {
  StyleSheet,
  View,
} from 'react-native';

import MathFactsApp from './MathFactsApp';

const WebAppWrapper = React.createClass({
  render: function() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <MathFactsApp />
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingTop: 20,
  },
  content: {
    height: 568,
    width: 320,
  },
});

module.exports = WebAppWrapper;