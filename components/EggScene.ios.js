'use strict';

import React from 'react-native';
import ReactART from 'ReactNativeART';

import Egg from '../components/graphics/Egg.ios'
import Hay from '../components/graphics/Hay.ios'

const {
  StyleSheet,
} = React;

const {
    Group,
    Path,
    Shape,
    Surface,
} = ReactART;

const EggScene = React.createClass({
  getInitialState: function() {
    return {
      eggRotation: 0,
    };
  },
  componentDidMount: function() {
    this.tick = 0;
    this.interval = setInterval(this.animate, 500);
  },
  componentDidUnmount: function() {
    clearInterval(this.interval);
  },
  animate: function() {
    this.setState({
      eggRotation:
        (this.state.eggRotation == 0) &&
        (this.tick % 9 == 8) ?
        5 :
        0,
    });
    this.tick++;
  },
  render: function() {
    const surfaceHeight = 130;
    const surfaceWidth = 500;
    const backgroundHeight = 60;
    return (
      <Surface
        width={surfaceWidth}
        height={surfaceHeight}
        style={styles.surface}>
        <Shape
          stroke="#724030" strokeWidth="1"
          fill='#8C533F'
          d={new Path()
            .moveTo(0, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight - backgroundHeight)
            .lineTo(0, surfaceHeight - backgroundHeight)
            .close()}
        />
        <Shape
          stroke="#724030" strokeWidth="1"
          fill='#8C533F'
          d={new Path()
            .moveTo(0, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight - backgroundHeight)
            .lineTo(0, surfaceHeight - backgroundHeight)
            .close()}
        />
        <Group y={15} x={185}>
          <Group x={0} y={35} scale={0.5}>
            <Hay />
          </Group>
          <Group
              x={38}
              y={0}
              scale={0.5}
              rotation={this.state.eggRotation}
              originX={35}
              originY={60}>
            <Egg />
          </Group>
        </Group>
      </Surface>
    );
  }
});

const styles = StyleSheet.create({
  surface: {
    backgroundColor: '#9cdceb',
    alignSelf: 'center',
    marginBottom: 10,
  }

});

module.exports = EggScene;