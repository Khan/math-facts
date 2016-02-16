'use strict';

import React from 'react-native';
const {
  Platform,
} = React;

import SH from '../helpers/style-helpers';

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
      'clock',
      'cog',
      'play',
    ]).isRequired,
  },
  getDefaultProps: function() {
    return {
      backgroundColor: SH.colors.inactive,
      color: SH.colors.active,
    };
  },
  render: function() {
    if (!Platform || Platform.OS === 'ios') {
      const ArtIcon = require('./ArtIcon');
      return <ArtIcon {...this.props} />
    }
    // TODO: RN for Android doesn't support ReactART yet, so just return
    // null so it runs at all. Hopefully they'll support it soon...
    return null;
  }
});

module.exports = Icon;