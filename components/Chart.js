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

const RP = React.PropTypes;

import { AppText, AppTextBold } from './AppText';

const circlePath = function(r) {
    return new Path()
        .moveTo(0, -r)
        // Two arcs make a circle
        .arcTo(0, r, r, r, true)
        .arcTo(0, -r, r, r, true)
        .close();
};

const ChartPoint = React.createClass({
  propTypes: {
    x: RP.number.isRequired,
    y: RP.number.isRequired,
  },
  render: function() {
    const {
      x,
      y,
      ...others
    } = this.props;
    return (
      <Group x={x} y={y}>
        <Shape
          {...others}
          d={circlePath(4)}
      />
      </Group>
    );
  },
});
const Chart = React.createClass({
  propTypes: {
    timeData: RP.arrayOf(
      RP.shape({
        time: RP.number,
        date: RP.number,
      })
    ).isRequired,
    learnerTypingTimes: RP.arrayOf(RP.number).isRequired,
  },
  render: function() {

    const {
      timeData,
    } = this.props;

    const surfaceHeight = 70;
    const surfaceWidth = 300;
    const surfacePadding = 5;

    let maxTime = 0;
    timeData.forEach((data) => {
      if (data.time > maxTime) {
        maxTime = data.time;
      }
    });

    const xOffset = surfaceWidth / timeData.length;
    const chartPoints = [];
    const chartLines = [];
    let prevX = null;
    let prevY = null;
    timeData.forEach((value, index) => {
      const x = xOffset * index + xOffset/2;
      const y = surfaceHeight - surfaceHeight * (value.time / maxTime);
      chartPoints.push(
        <ChartPoint
          // TODO: make this the color of the mastery level for that point?
          fill='#1c758a'
          stroke='#fff'
          key={'point-' + index}
          x={x}
          y={y}
        />
      );
      if (prevX != null) {
        chartLines.push(
          <Shape
            d={new Path().moveTo(x, y).lineTo(prevX, prevY)}
            key={'line-' + index}
            stroke='#000'
            strokeWidth={1}
          />
        );
      }
      prevX = x;
      prevY = y;
    });

    const speeds = [
      { speed: 'slow', color: '#D33131' },
      { speed: 'medium', color: '#FBC300' },
      { speed: 'fast', color: '#59A833' },
    ];

    const sectionHeight = (surfaceHeight - 2*surfacePadding) / speeds.length;

    const chartSections = speeds.map((section, idx) => {
      const sectionPath = new Path()
        .moveTo(0, idx * sectionHeight)
        .lineTo(surfaceWidth - surfacePadding*2, idx * sectionHeight)
        .lineTo(surfaceWidth - surfacePadding*2, (idx + 1) * sectionHeight)
        .lineTo(0, (idx + 1) * sectionHeight)
        .close();
      return (
        <Group x={0} y={0} key={'section-' + idx}>
          <Shape
            d={sectionPath}
            opacity={0.2}
            fill={section.color}
          />
        </Group>
      );
    });

    return (
      <View>
        <Surface
          width={surfaceWidth}
          height={surfaceHeight}
          style={styles.surface}
        >
          <Group x={surfacePadding} y={surfacePadding}>
            {chartSections}
            {chartLines}
            {chartPoints}
          </Group>

        </Surface>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  surface: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
  }
});


module.exports = Chart;