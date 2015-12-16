'use strict';

import React from 'react-native';
const {
  View,
} = React;

/**
 * This implements a generic pair of components that allows you to implement
 * keys with keyboard-like behavior. What is "keyboard-like behavior", you ask?
 * Here, it mostly means two things:
 *
 * 1. If you drag your finger around, the highlighted key follows it.
 * 2. If you press a second finger down, the key under the first finger is
 *    pressed and the "active touch" becomes your second finger.
 *
 * Just wrap all your keys in the <Keyboard> component and then use a
 * <Keyboard.Key> to make each key. Lay them out as you would any View -- this
 * component doesn't do any layout of its own.
 *
 * (This uses React's top-secret context feature and a bunch of imperative code
 * to highlight and unhighlight the keys. It all seems to work okay though. It
 * hasn't been tested if the keyboard (or any of the keys) reside within a
 * scroll view, and it definitely doesn't support keys moving around while you
 * have your fingers down.
 */

let idCounter = 1;

const KeyboardKey = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    highlightStyle: View.propTypes.style,
    children: React.PropTypes.node,
  },
  getInitialState: function() {
    return {
      highlighted: false,
      id: idCounter++,
    };
  },
  render: function() {
    const {style, highlightStyle, children} = this.props;
    return (
      <View
        ref="root"
        style={[style, this.state.highlighted && highlightStyle]}>
        {children}
      </View>
    );
  },
  contextTypes: {keyboard: React.PropTypes.object.isRequired},
  componentDidMount: function() {
    this.context.keyboard.registerKey(this.state.id, this);
  },
  componentWillUnmount: function() {
    this.context.keyboard.unregisterKey(this.state.id);
  },

  // Called by <Keyboard>:
  measure: function(fn) {
    return this.refs.root.measure(fn);
  },
  setHighlighted: function(highlighted) {
    this.setState({highlighted: highlighted});
  },
  triggerPress: function() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  },
});

const Keyboard = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },
  statics: {
    Key: KeyboardKey,
  },
  componentWillMount: function() {
    this._keys = {};
    this._keyLayouts = {};
    this._currentTouch = null;
    this._highlightedKeyId = null;
  },
  render: function() {
    return (
      <View
        onStartShouldSetResponder={this._handleStartShouldSetResponder}
        onResponderGrant={this._handleResponderGrant}
        onResponderStart={this._handleResponderStart}
        onResponderMove={this._handleResponderMove}
        onResponderRelease={this._handleResponderRelease}
        onResponderTerminate={this._handleResponderTerminate}>
        {this.props.children}
      </View>
    );
  },
  childContextTypes: {keyboard: React.PropTypes.object.isRequired},
  getChildContext: function() {
    return {keyboard: this};
  },
  _measureAllKeys: function() {
    for (let k in this._keys) {
      this._measureKey(k);
    }
  },
  _measureKey: function(k) {
    this._keys[k].measure((x, y, width, height, pageX, pageY) => {
      // If key k was unmounted before the measure call returns, this._keys[k]
      // will be undefined.
      if (this._keys[k]) {
        this._keyLayouts[k] = {width, height, pageX, pageY};
        this._updateHighlightedKeys();
      }
    });
  },
  _triggerKeyPress: function() {
    if (this._highlightedKeyId) {
      this._keys[this._highlightedKeyId].triggerPress();
    }
  },
  _updateHighlightedKeys: function() {
    const oldHighlight = this._highlightedKeyId;
    let newHighlight = null;
    const touch = this._currentTouch;
    if (touch) {
      for (let k in this._keyLayouts) {
        const key = this._keyLayouts[k];
        if (key.pageX <= touch.pageX &&
            touch.pageX <= key.pageX + key.width &&
            key.pageY <= touch.pageY &&
            touch.pageY <= key.pageY + key.height) {
          newHighlight = k;
          break;
        }
      }
    }
    if (oldHighlight !== newHighlight) {
      if (oldHighlight) {
        const oldKey = this._keys[oldHighlight];
        if (oldKey) {
          oldKey.setHighlighted(false);
        }
      }
      if (newHighlight) {
        this._keys[newHighlight].setHighlighted(true);
      }
    }
    this._highlightedKeyId = newHighlight;
  },
  _handleStartShouldSetResponder: function() {
    return true;
  },
  _handleResponderGrant: function(event) {
    const touch = event.nativeEvent.changedTouches[0];
    this._currentTouch = touch;
    this._measureAllKeys();
  },
  _handleResponderStart: function(event) {
    // If a new touch comes in, trigger a press then switch to it.
    this._triggerKeyPress();
    const touch = event.nativeEvent.changedTouches[0];
    this._currentTouch = touch;
    this._updateHighlightedKeys();
  },
  _handleResponderMove: function(event) {
    const currentTouchId = this._currentTouch && this._currentTouch.identifier;
    event.nativeEvent.changedTouches.forEach(function(touch) {
      if (touch.identifier === currentTouchId) {
        this._currentTouch = touch;
        this._updateHighlightedKeys();
      }
    }, this);
  },
  _handleResponderRelease: function(event) {
    // When a touch is lifted: trigger a press and remove the highlight
    const currentTouchId = this._currentTouch && this._currentTouch.identifier;
    event.nativeEvent.changedTouches.forEach(function(touch) {
      if (touch.identifier === currentTouchId) {
        this._triggerKeyPress();
        this._currentTouch = null;
        this._updateHighlightedKeys();
      }
    }, this);
  },
  _handleResponderTerminate: function(event) {
    // When a touch is canceled: remove the highlight but don't trigger a press
    const currentTouchId = this._currentTouch && this._currentTouch.identifier;
    event.nativeEvent.changedTouches.forEach(function(touch) {
      if (touch.identifier === currentTouchId) {
        this._currentTouch = null;
        this._updateHighlightedKeys();
      }
    }, this);
  },

  // Called by <KeyboardKey>:
  registerKey: function(keyId, key) {
    this._keys[keyId] = key;
    if (this._currentTouch) {
      this._measureKey(keyId);
    }
  },
  unregisterKey: function(keyId) {
    delete this._keys[keyId];
    delete this._keyLayouts[keyId];
    this._updateHighlightedKeys();
  },
});

module.exports = Keyboard;
