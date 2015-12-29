/**
 * Math Facts App
 */
'use strict';

import React, { StyleSheet } from 'react-native';
import Promise from 'promise';

global.Promise = Promise;

import MathFactsApp from './components/MathFactsApp';

React.render(<MathFactsApp />, document.getElementById('content'));
