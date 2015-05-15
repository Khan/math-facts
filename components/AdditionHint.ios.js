'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

var { AppText, AppTextBold, AppTextThin } = require('./AppText.ios');

var Circle = require('../components/Circle.ios')

var AdditionHint = React.createClass({
  render: function() {
    var left = this.props.left;
    var right = this.props.right;
    var total = this.props.left + this.props.right;

    var rgb = this.props.color;

    var num = 1;
    var hint = _.map(_.range(0, 2), (hint10) => {
      var backgroundColor = hint10 % 10 ?
            'rgba(255, 255, 255, 0.5)' :
            'rgba(255, 255, 255, 0.3)';
      return (
        <View
            style={[styles.hint10, {backgroundColor: backgroundColor}]}
            key={'hint10-' + hint10}>
        {_.map(_.range(0, 2), (hint5) => {
          return (
            <View
                style={styles.hint5}
                key={'hint5-' + hint5}>
            {_.map(_.range(0, 5), () => {
              var offset = hint10 * 10 + hint5 * 5;
              var round = hint5 === 0 ? Math.ceil : Math.floor;
              var showLeft = num - offset <= round((left - hint10 * 10)/2);
              var showRight = num - offset <= round((total - hint10 * 10)/2);

              var color = showLeft ? '#fff' :
                          showRight ? 'rgba(0, 0, 0, 0.6)' :
                          'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+', 0.4)';
              num++;
              return (
                <Circle
                  size={15}
                  color={color}
                  key={'circle-' + num}/>
            );
          })}
          </View>
          );
        })}
        </View>
      );
    });
    return (<View style={styles.hint}>{hint}</View>);
  }
});


var styles = StyleSheet.create({

  hintContainer: {
    flex: 0,
    height: 50,
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  hint: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  hint10: {
    flex: 0,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  hint5: {
    flex: 1,
    flexDirection: 'row'
  },

});

module.exports = AdditionHint;