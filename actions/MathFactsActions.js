import AppDispatcher from '../dispatcher/AppDispatcher';
import MathFactsConstants from '../constants/MathFactsConstants';

const MathFactsActions = {

  initializeData: function() {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.INITIALIZE,
    });
  },

  isLoaded: function() {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.IS_LOADED,
    });
  },

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
  clearData: function() {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.DATA_CLEAR,
    });
  },

  addPoints: function(amount) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.POINTS_ADD,
      amount: amount,
    });
  },

  addUser: function(name) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.USERS_ADD,
      name: name,
    });
  },

  changeName: function(name) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.USERS_CHANGE_NAME,
      name: name,
    });
  },

  changeActiveUser: function(id) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.USERS_CHANGE_ACTIVE_USER,
      id: id,
    });
  },

  setOperation: function(operation) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.OPERATION_CHANGE,
      operation: operation,
    });
  },

  setTime: function(time) {
    AppDispatcher.dispatch({
      actionType: MathFactsConstants.TIME_CHANGE,
      time: time,
    });
  },

};

module.exports = MathFactsActions;