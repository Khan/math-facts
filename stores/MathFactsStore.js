var _ = require('underscore');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var React = require('react-native');
var AsyncStorage = React.AsyncStorage;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MathFactsConstants = require('../constants/MathFactsConstants');

var CHANGE_EVENT = 'change';


/**
 * Points
 */
var _points = 0;

var addPoints = function(amount) {
  _points += amount;
  updateStoredPoints();
};

var updateStoredPoints = function() {
  AsyncStorage.setItem('points', _points.toString()).done();
};

var fetchPoints = function() {
  return AsyncStorage.getItem('points').then((points) => {
    _points = (points == null) ? 0 : parseInt(points);
    MathFactStore.emitChange();
  }).done();
};

/**
 * Fact Data
 *
 * _factData = {
 *  'multiplication': [
 *    [[{data for 1x1}, {more data for 1x1}], [{data for 1x2}], [...]],
 *    [[{data for 2x1}, {more data for 2x1}], [{data for 2x2}], [...]],
 *    [...],
 *   ],
 *  'addition': [
 *    [[{data for 1+1}, {more data for 1+1}], [{data for 1+2}], [...]],
 *    [[{data for 2+1}, {more data for 2+1}], [{data for 2+2}], [...]],
 *    [...],
 *  ],
 *  'typing': [
 *    [{data for 1}, {more data for 1}], [{data for 2}], [...]
 *  ]
 *
 */
var _factData = {
  'multiplication': [],
  'addition': [],
  'typing': [],
};


/**
 * Adds fact attempts to the data store
 * Takes and operation and data as an array of attempts in the form:
 * [{inputs: [1, 2], data: {...}}, {inputs: [7, 4], data: {...}}]
 *
 */
var addAttempts = function(operation, data) {
  _.each(data, (attempt) => {
    var inputs = attempt.inputs;
    var attemptData = attempt.data;

    // Initialize the row if it's empty
    if (_factData[operation][inputs[0]] == null) {
      _factData[operation][inputs[0]] = [];
    }

    if (inputs.length === 1) {
      // If this operation takes a single input:
      _factData[operation][inputs[0]].push(attempt);
    } else if (inputs.length === 2) {
      // If this operation takes two inputs:
      if (_factData[operation][inputs[0]][inputs[1]] == null) {
        _factData[operation][inputs[0]][inputs[1]] = [];
      }
      _factData[operation][inputs[0]][inputs[1]].push(attemptData);
    }
  });
  updateStoredFactData();
};

var fetchStoredFactData = function() {
  var keys = _.map(_factData, (data, operation) => {
    return operation;
  });

  return AsyncStorage.multiGet(keys).then((keyValuePairs) => {
    var newFactData = {};
    _.each(keyValuePairs, (operationData) => {
      var operation = operationData[0];
      var data = JSON.parse(operationData[1]);
      newFactData[operation] = (data == null) ? [] : data;
    });
    _factData = newFactData;
    MathFactStore.emitChange();
  }).done();

};

var updateStoredFactData = function() {
  var keyValuePairs = _.map(_factData, (data, operation) => {
    return [operation, JSON.stringify(data)];
  });
  AsyncStorage.multiSet(keyValuePairs).done();
};

var MathFactStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire database of Math Facts
   * @return {object}
   */
  getAll: function() {
    return _factData;
  },

  getPoints: function() {
    return _points;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case MathFactsConstants.FACT_DATA_ADD:
      var operation = action.operation;
      var data = action.data;
      if (!_.isEmpty(data)) {
        addAttempts(operation, data);
        MathFactStore.emitChange();
      }
      break;

    case MathFactsConstants.FACT_DATA_INITIALIZE:
      fetchStoredFactData();
      break;

    case MathFactsConstants.POINTS_INITIALIZE:
      fetchPoints();
      break;

    case MathFactsConstants.POINTS_ADD:
     var amount = action.amount;
     addPoints(amount);
     MathFactStore.emitChange();
     break;

    default:
      // no op
  }
});

module.exports = MathFactStore;