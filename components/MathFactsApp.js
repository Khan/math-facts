'use strict';

import React from 'react-native';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import MathFactsStore from '../stores/MathFactsStore';
import StateFromStoreMixin from '../lib/state-from-store-mixin.js';

import Navigation from './Navigation';

const MathFactsApp = React.createClass({
  // TODO: get state changes lower down so scenes update before they're
  // rendered (Navigator currently blocks state changes for hidden scenes
  // while it's animating them in).
  mixins: [
    StateFromStoreMixin({
      data: {
        store: MathFactsStore,
        fetch: (store) => {
          return store.getStoreData();
        }
      },
    })
  ],
  componentDidMount: function() {
    if (Platform.OS === 'ios') {
      // TODO: add support for CodePush on Android
      const CodePush = require('react-native-code-push');
      CodePush.sync({rollbackTimeout: 3000});
    }
  },
  render: function() {
    return (
      <View style={styles.appWrapper}>
        <Navigation {...this.state.data} />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: '#555'
  },
});

module.exports = MathFactsApp;