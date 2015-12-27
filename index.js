/**
 * Math Facts App
 */
'use strict';

import React, { StyleSheet } from 'react-native';
import ReactDOM from 'react-dom';
import Promise from 'promise';

global.Promise = Promise;

import MathFactsApp from './components/MathFactsApp';

if (document) {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  const css = StyleSheet.renderToString();
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

ReactDOM.render(<MathFactsApp />, document.getElementById('content'));
