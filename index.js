/**
 * Math Facts App
 */
'use strict';

import React, { StyleSheet } from 'react-native';
import Promise from 'promise';

global.Promise = Promise;

import WebAppWrapper from './components/WebAppWrapper';

React.render(<WebAppWrapper />, document.getElementById('content'));
