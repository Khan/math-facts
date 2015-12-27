'use strict';

import React, { Touchable, TouchableHighlight } from 'react-native';

const MyTouchableHighlight = React.createClass({
    render: function () {
        if (TouchableHighlight) {
            return <TouchableHighlight {...this.props} />;
        } else if (Touchable) {
            return <Touchable {...this.props} />;
        }
    },
});

module.exports = MyTouchableHighlight;