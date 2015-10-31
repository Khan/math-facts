'use strict';

import React from 'react-native';
import ReactART from 'ReactNativeART';

const {
    Group,
    Path,
    Shape,
    Surface,
} = ReactART;
const {
  StyleSheet,
  View,
} = React;

const Egg = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      color: 'green',
    };
  },
  render: function() {
    const color = {
      green: {light: '#65C98D', dark: '#35644A'}
    }[this.props.color];
    return (
      <Group>
        <Shape fill={color.light} stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" d="M39.2,145.1c50.2,15.3,76.4-18.1,80-49.5
        c4.2-36.3-9.1-82.8-40-92.6C54.4-4.9,20.6,37.3,7.1,71.9C-8.6,111.9,15,137.7,39.2,145.1z"/>
        <Shape opacity="0.5" fill={color.dark} d="M56.9,24.4c2.8-1.6,10.5,4.8,10.3,7s-7,13.2-12.3,12s-12.8-3.5-12.2-8S55.1,25.4,56.9,24.4z"
        />
        <Shape opacity="0.5" fill={color.dark} d="M42.6,50.9c3.2-3.4,13-0.5,14,1.5s4.5,11.2-1.8,16s-11.5,0.5-14.7,0S31.3,62.9,42.6,50.9z"/>
        <Shape opacity="0.5" fill={color.dark} d="M96.6,109.2c0,0-13.8,11.8-13.2,15.8s5.2,10.2,13.2,1S104.9,114.9,96.6,109.2z"/>
        <Shape opacity="0.5" fill={color.dark} d="M105.4,95.9c0,0-8.4,8.5,1.8,9S107.7,92.9,105.4,95.9z"/>
        <Shape opacity="0.5" fill={color.dark} d="M72.1,128.7c0,0-6,9.2,1.5,8.5S75.6,125.2,72.1,128.7z"/>
        <Shape opacity="0.5" fill={color.dark} d="M74.9,43.5c0,0-11.2-0.1-5,12.7C71.7,60,83.4,45.8,74.9,43.5z"/>
        <Shape opacity="0.5" fill={color.dark} d="M75.1,15.9c0,0-8.2,6.7-3.2,8.2C76.9,25.7,83.1,15.9,75.1,15.9z"/>
        <Shape opacity="0.5" fill={color.dark} d="M30.6,43.5c0,0-9.5,8.4-3,11.8C34.1,58.7,40.4,39.4,30.6,43.5z"/>
        <Group>
          <Shape fill={color.dark} d="M107.2,33.1c-0.1-0.3-0.2-0.6-0.3-0.7C106.7,32.2,106.8,32.4,107.2,33.1z"/>
          <Shape opacity="0.2" fill={color.dark} d="M39.2,145.1c50.2,15.3,76.4-18.1,80-49.5c2.4-20.4-0.8-44-9.5-62.5
            c1.7,6.9-7.7,53.2-43.8,68.3C28.2,117.2,7.6,70.7,7.6,70.7c-0.2,0.4-0.3,0.8-0.5,1.3C-8.6,111.9,15,137.7,39.2,145.1z"/>
        </Group>
      </Group>
    );
  }
});

module.exports = Egg;