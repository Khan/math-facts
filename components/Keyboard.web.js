'use strict';

import React from 'react-native';
const {
  Touchable,
  View,
} = React;

const KeyboardKey = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    style: View.propTypes.style,
    highlightStyle: View.propTypes.style,
    children: React.PropTypes.node,
  },
  getInitialState: function() {
    return {
      highlighted: false,
    };
  },
  render: function() {
    const {
      style,
      highlightStyle,
      children,
      onPress
    } = this.props;
    return (
      <Touchable
        style={[style, this.state.highlighted && highlightStyle]}
        activeUnderlayColor='transparent'
        onPress={onPress}
      >
        {children}
      </Touchable>
    );
  },
  setHighlighted: function(highlighted) {
    this.setState({highlighted: highlighted});
  },
});

const Keyboard = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },
  statics: {
    Key: KeyboardKey,
  },
  render: function() {
    return <View>
      {this.props.children}
    </View>;
  },
});

module.exports = Keyboard;
