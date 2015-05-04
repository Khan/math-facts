'use strict';

var _ = require('underscore');

var React = require('react-native');
var AsyncStorage = React.AsyncStorage;

function makeKey(operation: string, inputs: Array<int>): string {
  var key = operation + '-';

  _.each(inputs, function(input, i) {
    key += (i === 0 ? '' : ',') + input;
  });

  return key;
}

var MathFactsDB = {
  /*
   * Data is stored in the form:
   *   operation => inputs => [data, data, data, ...]
   *                inputs => data
   *                inputs => data
   *                ...
   *
   * @param  String  operation    The type of fact (e.g. addition, multiplication)
   * @param  Array   inputs  An array of inputs (e.g. [factor, multiplier])
   * @param  Object  data    The data about the fact
   * @return Promise
   */
  addFactAttempt: function(operation: string, inputs: Array<int>, data: object):
      Promise {
    var key = makeKey(operation, inputs);

    return AsyncStorage.getItem(key).then((currentData) => {
      if (currentData != null) {
        // Add the new data to the list
        var list = JSON.parse(currentData);
        list.push(data);
        return AsyncStorage.setItem(key, JSON.stringify(list));
      } else {
        return AsyncStorage.setItem(key, JSON.stringify([data]));
      }
    }, (error) => {
      // Add a list with a single value if it doesn't exist
      return AsyncStorage.setItem(key, JSON.stringify([data]));
    });
  },

  /*
   * Get the array of data for the given fact
   *
   * @param  String  operation  The type of fact (e.g. addition, multiplication)
   * @param  Array   inputs     An array of inputs (e.g. [factor, multiplier])
   * @return Promise
   */
  getAttemptsForFact: function(operation: string, inputs: Array<int>): Promise {
    var key = makeKey(operation, inputs);

    return AsyncStorage.getItem(key).then((data) => {
      return JSON.parse(data);
    }, (error) => {
      return [];
    });
  },

  /*
   * Get data for each fact in a range of facts
   * e.g. 'multiplication', [[1, 1], [5, 5]] yields all facts b/w 1x1 and 5x5
   *
   * @param  String  operation The type of fact (e.g. addition, multiplication)
   * @param  Array   range     A range of inputs from [factor1, multiplier1] to
   *                           [factor2, multiplier2].
   * @return Promise
   */
  getFactsInRange: function(operation: string, range: Array<Array<int>>):
      Promise {
    var flippedRange = _.map(range[0], (left, i) => {
      return [left, range[1][i]];
    });

    /* Taken from http://stackoverflow.com/a/12628791/57318 */
    var inputs = _.reduce(flippedRange, (currInputs, inputRange) => {
      return _.flatten(_.map(currInputs, (currInput) => {
        return _.map(_.range(inputRange[0], inputRange[1] + 1), (input) => {
          return currInput.concat([input]);
        });
      }), true);
    }, [[]]);

    return Promise.all(_.map(inputs, (input) => {
      return MathFactsDB.getAttemptsForFact(operation, input).then(
        (attempts) => {
          return {
            input: input,
            attempts: attempts
          };
        });
    }));
  }
};

module.exports = MathFactsDB;