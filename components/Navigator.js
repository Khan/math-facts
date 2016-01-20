'use strict';

import React from 'react-native';

const Navigator = React.createClass({
  propTypes: {
    initialRoute: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
    }),
    renderScene: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      route: null,
    };
  },
  push: function(route) {
    this.setState({
      route: route,
    });
  },
  popToTop: function(route) {
    this.setState({
      route: this.props.initialRoute,
    });
  },
  render: function() {
    const route = this.state.route ?
      this.state.route :
      this.props.initialRoute;

    return this.props.renderScene(route, this);
  }
});

module.exports = React.Navigator ? React.Navigator : Navigator;