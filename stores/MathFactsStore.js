var _ = require('underscore');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var React = require('react-native');
var AsyncStorage = React.AsyncStorage;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MathFactsConstants = require('../constants/MathFactsConstants');

var CHANGE_EVENT = 'change';



/**
 * Users are stored as an object with their id (int) and their name (string).
 * The UserList is an array of user objects
 */
var _user = {
  id: 1,
  name: 'Player',
  deleted: false,
};
var _userList = [ _user ];

var createKey = function(input) {
  return _user.id + '-' + input;
};

var addUser = function(userName) {
  var newUser = {
    id: _userList.length,
    name: userName,
    deleted: false
  };
  _userList.push(newUser);
  changeActiveUser(newUser);
  updateUserData();
};

var changeActiveUser = function(user) {
  _user = user;
  updateUserData();
};

var updateUserData = function() {
  AsyncStorage.setItem('user', _user).done();
  AsyncStorage.setItem('users', JSON.stringify(_userList)).done();
};

var fetchUserData = function() {
  return Promise.all([
    AsyncStorage.getItem('user').then((user) => {
      _user = (user == null) ? null : user;
    }),
    AsyncStorage.getItem('users').then((userList) => {
      _userList = (userList == null) ? [] : JSON.parse(userList);
    }),
  ]).then(() => {
    MathFactStore.emitChange();
  }).done();
};

/**
 * Points
 */
var _points = 0;
var _scores = [];

var addPoints = function(amount) {
  _points += amount;
  _scores.push(amount);
  MathFactStore.emitChange();
  updateStoredPoints();
};

var updateStoredPoints = function() {
  AsyncStorage.setItem(createKey('points'), _points.toString()).done();
  AsyncStorage.setItem(createKey('scores'), JSON.stringify(_scores)).done();
};

var fetchPoints = function() {
  return Promise.all([
    AsyncStorage.getItem(createKey('points')).then((points) => {
      _points = (points == null) ? 0 : parseInt(points);
    }),
    AsyncStorage.getItem(createKey('scores')).then((scores) => {
      _scores = (scores == null) ? [] : JSON.parse(scores);
    }),
  ]).then(() => {
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
var defaultFactData = {
  'multiplication': null,
  'addition': null,
  'typing': null,
};
var _factData = defaultFactData;


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
  return AsyncStorage.getItem(createKey('factData')).then((factData) => {
    var newFactData = {};
    var factData = JSON.parse(factData);
    if (factData == null) {
      factData = defaultFactData;
    }
    _.each(defaultFactData, (defaultData, operation) => {
      var data = factData[operation];
      newFactData[operation] = (data == null) ? [] : data;
    });
    _factData = newFactData;
    MathFactStore.emitChange();
  }).done();

};

var updateStoredFactData = function() {
  AsyncStorage.setItem(createKey('factData'), JSON.stringify(_factData)).done();
};

// Clear all data
var clearData = function() {

  return Promise.all([
    AsyncStorage.removeItem(createKey('factData')),
    AsyncStorage.removeItem(createKey('points')),
    AsyncStorage.removeItem(createKey('scores'))
  ]).then(() => {
    return Promise.all([
      fetchPoints(),
      fetchStoredFactData()
    ]);
  }).then(() => {
    MathFactStore.emitChange();
  }).done();
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

  getScores: function() {
    return _scores;
  },

  getUser: function() {
    return _user;
  },

  getUserList: function() {
    return _userList;
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
      break;

    case MathFactsConstants.DATA_CLEAR:
      clearData();
      break;

    case MathFactsConstants.USERS_INITIALIZE:
      fetchUser();
      break;

    case MathFactsConstants.USERS_ADD:
      var newUserName = action.userName;
      addUser(newUserName);

    default:
      // no op
  }
});

module.exports = MathFactStore;