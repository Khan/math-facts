var AppDispatcher = require('../dispatcher/AppDispatcher');
var MathFactsConstants = require('../constants/MathFactsConstants');

var MathFactsActions = {

  /**
   * Adds fact attempts to the data store
   * Takes and operation and data as an array of attempts in the form:
   * [{inputs: [1, 2], data: {...}}, {inputs: [7, 4], data: {...}}]
   *
   */
  addAttempts: function(operation, data) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.FACT_DATA_ADD,
      operation: operation,
      data: data
    });
  },

  initializeData: function() {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.FACT_DATA_INITIALIZE,
    });
  },

  addPoints: function(amount) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.POINTS_ADD,
      amount: amount,
    });
  },

  initializePoints: function() {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.POINTS_INITIALIZE,
    });
  },

};

module.exports = MathFactsActions;