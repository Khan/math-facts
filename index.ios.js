/**
 * Math Facts App
 */
'use strict';

import React from 'react-native';
var {
  AppRegistry,
} = React;

import MathFactsApp from './components/MathFactsApp.ios';

AppRegistry.registerComponent('MathFacts', () => MathFactsApp);
