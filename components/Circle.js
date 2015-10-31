'use strict';

import React from 'react-native';
const {
  View,
} = React;

const Circle = React.createClass({
  render: function() {
    const size = this.props.size || 20;
    const color = this.props.color || '#527fe4';
    return (
      <View
        style={{
          borderRadius: size / 2,
          backgroundColor: color,
          width: size,
          height: size,
          margin: 3,
        }}
      />
    );
  }
});

module.exports = Circle;