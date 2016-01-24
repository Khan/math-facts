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
        Value: function() {},
        spring: function() {},
        View: View,
    };
}

module.exports = MyAnimated;