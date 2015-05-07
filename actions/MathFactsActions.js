var AppDispatcher = require('../dispatcher/AppDispatcher');
var MathFactsConstants = require('../constants/MathFactsConstants');

var MathFactsActions = {

  addAttempts: function(operation, data) {
    // Takes data as an array of attempt data in the form:
    // [{inputs: [1, 2], data: {...} }]
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