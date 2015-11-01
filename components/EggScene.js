'use strict';

import React from 'react-native';
import ReactART from 'ReactNativeART';

import Egg from '../components/graphics/Egg'
import Hay from '../components/graphics/Hay'

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
  componentWillUnmount: function() {
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
    const surfaceHeight = 200;
    const surfaceWidth = 500;
    const backgroundHeight = 60;
    return (
      <Surface
        width={surfaceWidth}
        height={surfaceHeight}
        style={styles.surface}>
        <Shape
          fill='#704121'
          d={new Path()
            .moveTo(0, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight)
            .lineTo(surfaceWidth, surfaceHeight - backgroundHeight)
            .lineTo(0, surfaceHeight - backgroundHeight)
            .close()}
        />
        <Group y={85} x={185}>
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
    backgroundColor: '#935D38',
    alignSelf: 'center',
    marginBottom: 10,
  }

});

module.exports = EggScene;