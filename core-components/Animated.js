'use strict';

import {
    Animated,
    View,
} from 'react-native';

let MyAnimated;
if (Animated) {
    MyAnimated = Animated;
} else {
    MyAnimated = {
        Value: function() {
            return {
                setValue: function() {},
            };
        },
        spring: function() {
            return {
                start: function() {},
            };
        },
        View: View,
    };
}

module.exports = MyAnimated;