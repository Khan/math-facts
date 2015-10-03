'use strict';

import React from 'react-native';
var {
  View,
} = React;

var Circle = React.createClass({
  render: function() {
    var size = this.props.size || 20;
    var color = this.props.color || '#527fe4';
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