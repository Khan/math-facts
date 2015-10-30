'use strict';

import _ from 'underscore';

import React from 'react-native';
const {
  StyleSheet,
  View,
} = React;
var ReactART = require('ReactNativeART');

var {
    Group,
    Path,
    Shape,
    Surface,
} = ReactART;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

const circlePath = function(r) {
    return new Path()
        .moveTo(0, -r)
        // Two arcs make a circle
        .arcTo(0, r, r, r, true)
        .arcTo(0, -r, r, r, true)
        .close();
};

const Chart = React.createClass({
  render: function() {
    return (
      <View>
        <Surface
          width={100}
          height={100}>
            <Group x={50} y={50}>
              <Shape
                fill="#ddd"
                stroke="#777"
                strokeWidth="2"
                strokeJoin="round"
                d={circlePath(20)}/>
            </Group>
        </Surface>
      </View>
    );
  },
});


module.exports = Chart;