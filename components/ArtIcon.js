'use strict';

import React from 'react-native';
import ReactART from 'ReactNativeART';

const {
    Group,
    Path,
    Shape,
    Surface
} = ReactART;

const circlePath = function(r) {
  // relative to center of the circle
  return new Path()
    .moveTo(0, -r)
    // Two arcs make a circle
    .arcTo(0, r, r, r, true)
    .arcTo(0, -r, r, r, true)
    .close();
};
const squarePath = function(size) {
  // relative to top left of the square
  return new Path()
    .moveTo(0, 0)
    .lineTo(0, size)
    .lineTo(size, size)
    .lineTo(size, 0)
    .close();
};

const BASE_ICON_SIZE = 10;

const paths = {
  /* Icons should be 10px by 10px so they scale properly with this formula */
  cog: `M10.3,4.4v1.5c0,0.1,0,0.1-0.1,0.2c0,0-0.1,0.1-0.1,0.1L8.9,6.3C8.8,6.6,8.7,6.8,8.6,6.9C8.8,7.2,9,7.5,9.3,7.9
        C9.4,7.9,9.4,8,9.4,8s0,0.1-0.1,0.2C9.2,8.3,9,8.6,8.7,8.9C8.3,9.2,8.1,9.4,8,9.4c-0.1,0-0.1,0-0.2-0.1L6.9,8.6
        C6.7,8.7,6.5,8.8,6.3,8.9c-0.1,0.6-0.1,1-0.2,1.2c0,0.1-0.1,0.2-0.2,0.2H4.4c-0.1,0-0.1,0-0.2-0.1c0,0-0.1-0.1-0.1-0.1L4,8.9
        C3.8,8.8,3.6,8.7,3.4,8.6L2.4,9.3c0,0-0.1,0.1-0.2,0.1c-0.1,0-0.1,0-0.2-0.1C1.5,8.8,1.2,8.4,1,8.2c0,0,0-0.1,0-0.2
        C0.9,8,1,7.9,1,7.9c0.1-0.1,0.2-0.2,0.3-0.4S1.6,7.1,1.7,7C1.6,6.7,1.5,6.5,1.4,6.3L0.2,6.1c-0.1,0-0.1,0-0.1-0.1C0,6,0,5.9,0,5.9
        V4.4c0-0.1,0-0.1,0.1-0.2c0,0,0.1-0.1,0.1-0.1L1.4,4c0.1-0.2,0.1-0.4,0.3-0.6C1.5,3.1,1.3,2.8,1,2.4c0-0.1-0.1-0.1-0.1-0.2
        c0,0,0-0.1,0.1-0.2c0.1-0.2,0.3-0.4,0.7-0.7c0.3-0.3,0.5-0.5,0.6-0.5c0.1,0,0.1,0,0.2,0.1l0.9,0.7C3.6,1.6,3.8,1.5,4,1.4
        c0.1-0.6,0.1-1,0.2-1.2C4.2,0.1,4.3,0,4.4,0h1.5C5.9,0,6,0,6.1,0.1s0.1,0.1,0.1,0.1l0.2,1.2c0.2,0.1,0.4,0.2,0.6,0.2l1-0.7
        c0,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2,0.1c0.6,0.5,0.9,0.9,1.1,1.1c0,0,0,0.1,0,0.1c0,0.1,0,0.1-0.1,0.2C9.2,2.5,9.1,2.7,9,2.9
        C8.8,3.1,8.7,3.2,8.6,3.3C8.7,3.6,8.8,3.8,8.9,4l1.2,0.2c0.1,0,0.1,0,0.1,0.1S10.3,4.4,10.3,4.4z M6.4,6.4C6.7,6,6.9,5.6,6.9,5.1
        S6.7,4.3,6.4,3.9C6,3.6,5.6,3.4,5.1,3.4c-0.5,0-0.9,0.2-1.2,0.5C3.6,4.3,3.4,4.7,3.4,5.1S3.6,6,3.9,6.4c0.3,0.3,0.7,0.5,1.2,0.5
        C5.6,6.9,6,6.7,6.4,6.4z`,
  play: `M10.2,5.4L2.3,9.8c-0.1,0.1-0.2,0.1-0.2,0C2,9.8,2,9.7,2,9.6V0.8c0-0.1,0-0.2,0.1-0.2c0.1,0,0.1,0,0.2,0L10.2,5
        c0.1,0.1,0.1,0.1,0.1,0.2C10.4,5.3,10.3,5.3,10.2,5.4z`,
  chevronRight: `M9.7,5.7l-5,5c-0.1,0.1-0.2,0.1-0.3,0.1s-0.2,0-0.3-0.1L3,9.6C2.9,9.5,2.9,9.4,2.9,9.3C2.9,9.1,2.9,9,3,9l3.6-3.6L3,1.8
        C2.9,1.8,2.9,1.7,2.9,1.5s0-0.2,0.1-0.3l1.1-1.1C4.2,0,4.3,0,4.4,0s0.2,0,0.3,0.1l5,5c0.1,0.1,0.1,0.2,0.1,0.3
        C9.8,5.5,9.8,5.6,9.7,5.7z`,
  angleBracketLeft: `M4.9,0.6c0,0.1,0,0.1-0.1,0.2L2.2,3.3L4.8,6c0,0,0.1,0.1,0.1,0.2s0,0.1-0.1,0.2L4.5,6.6c0,0-0.1,0.1-0.2,0.1
    c-0.1,0-0.1,0-0.2-0.1L1.1,3.5C1,3.5,1,3.4,1,3.3s0-0.1,0.1-0.2l3.1-3.1C4.2,0,4.3,0,4.3,0c0.1,0,0.1,0,0.2,0.1l0.3,0.3
    C4.9,0.4,4.9,0.5,4.9,0.6z`,
  angleBracketRight: `M2.9,0.6l0.5-0.5C3.4,0,3.5,0,3.6,0c0.1,0,0.2,0,0.2,0.1l4.5,4.5c0.1,0.1,0.1,0.1,0.1,0.2c0,0.1,0,0.2-0.1,0.2L3.8,9.6
    C3.7,9.7,3.7,9.7,3.6,9.7c-0.1,0-0.2,0-0.2-0.1L2.9,9.2C2.8,9.1,2.8,9,2.8,8.9c0-0.1,0-0.2,0.1-0.2l3.8-3.8L2.9,1
    C2.8,1,2.8,0.9,2.8,0.8C2.8,0.7,2.8,0.7,2.9,0.6z`,
  check: `M10,3.3c0,0.2-0.1,0.3-0.2,0.4L5.2,8.4L4.3,9.3C4.2,9.4,4,9.4,3.8,9.4S3.5,9.4,3.4,9.3L2.5,8.4L0.2,6C0.1,5.9,0,5.8,0,5.6
    c0-0.2,0.1-0.3,0.2-0.4l0.9-0.9c0.1-0.1,0.3-0.2,0.4-0.2c0.2,0,0.3,0.1,0.4,0.2l1.9,1.9l4.2-4.2c0.1-0.1,0.3-0.2,0.4-0.2
    c0.2,0,0.3,0.1,0.4,0.2l0.9,0.9C9.9,2.9,10,3.1,10,3.3z`,
  none: ``,
};

const Icon = React.createClass({
  propTypes: {
    backgroundColor: React.PropTypes.string,
    backgroundType: React.PropTypes.oneOf(['circle', 'square',]),
    color: React.PropTypes.string,
    size: React.PropTypes.number,
    type: React.PropTypes.oneOf([
      'none',

      'angleBracketLeft',
      'angleBracketRight',
      'check',
      'chevronRight',
      'cog',
      'play',
    ]).isRequired,
  },
  getDefaultProps: function() {
    return {
      backgroundColor: '#ddd',
      color: '#29abca',
    };
  },
  render: function() {
    const {
      backgroundColor,
      backgroundType,
      color,
      size,
      type,
    } = this.props;
    const padding = 1;
    const innerSize = (size - padding * 2);
    const radius = innerSize / 2;
    const iconScale = backgroundType ?
      (innerSize / BASE_ICON_SIZE) / 2 :
      (innerSize / BASE_ICON_SIZE);
    const offset = backgroundType ?
      (innerSize - BASE_ICON_SIZE * iconScale) / 2 : 0;
    return (
      <Surface width={size} height={size}>
        <Group x={padding} y={padding}>
          {backgroundType === 'circle' && <Group x={radius} y={radius}>
            <Shape fill={backgroundColor} d={circlePath(radius)} />
          </Group>}
          {backgroundType === 'square' && <Group>
            <Shape fill={backgroundColor} d={squarePath(innerSize)} />
          </Group>}
          <Group x={offset} y={offset}>
            <Shape
              scale={iconScale}
              fill={color}
              d={paths[type]}/>
          </Group>
        </Group>
      </Surface>
    );
  }
});

module.exports = Icon;