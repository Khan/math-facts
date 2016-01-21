'use strict';

import React, { Touchable, TouchableHighlight } from 'react-native';

const MyTouchableHighlight = React.createClass({
    render: function () {
        if (TouchableHighlight) {
            return <TouchableHighlight {...this.props} />;
        } else if (Touchable) {
            const {
                activeUnderlayColor,
                ...other,
            } = this.props;
            return <Touchable
                activeUnderlayColor={
                    this.props.underlayColor && !activeUnderlayColor ?
                    this.props.underlayColor : activeUnderlayColor
                }
                {...this.props}
            />;
        }
    },
});

module.exports = MyTouchableHighlight;