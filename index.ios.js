/**
 * Math Facts App
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var MathFactsApp = require('./components/MathFactsApp.ios')

AppRegistry.registerComponent('MathFacts', () => MathFactsApp);
