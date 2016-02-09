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
        <View style={styles.innerWrapper}>
          <View style={styles.content}>
            <MathFactsApp />
          </View>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  innerWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 568,
    maxHeight: 700,
  },
  content: {
    flex: 1,
    minWidth: 320,
    maxWidth: 500,
  },
});

module.exports = WebAppWrapper;