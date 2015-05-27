var _ = require('underscore');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var React = require('react-native');
var AsyncStorage = React.AsyncStorage;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MathFactsConstants = require('../constants/MathFactsConstants');

var CHANGE_EVENT = 'change';


var _isLoaded = false;

/**
 * Users are stored as an object with their id (int) and their name (string).
 * The UserList is an array of user objects
 */
var defaultUser = {
  id: 0,
  name: 'Player',
  deleted: false,
};
// The active user is the key of the user in _userList
var _activeUser = 0;
var _userList = [ defaultUser ];

var createKey = function(input) {
  var key = _activeUser + '-' + input;
  return key;
};

var addUser = function(userName) {
  var userId = _userList.length;
  var newUser = {
    id: userId,
    name: userName,
    deleted: false
  };
  _userList.push(newUser);
  changeActiveUser(userId);
  MathFactStore.emitChange();
  updateUserData().done();
};

var changeUserName = function(userName) {
  _userList[_activeUser].name = userName;
  MathFactStore.emitChange();
  updateUserData();
};

var changeActiveUser = function(id) {
  _activeUser = id;
  _isLoaded = false;
  updateUserData().then(fetchStoredData).done();
};

var updateUserData = function() {
  return Promise.all([
    AsyncStorage.setItem('activeUser', _activeUser.toString()),
    AsyncStorage.setItem('userList', JSON.stringify(_userList)),
  ]);
};

var fetchUserData = function() {
  return Promise.all([
    AsyncStorage.getItem('activeUser').then((user) => {
      _activeUser = (user == null) ? _activeUser : user;
    }),
    AsyncStorage.getItem('userList').then((userList) => {
      _userList = (userList == null) ? _userList : JSON.parse(userList);
    }),
  ]);
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

var fetchFactData = function() {
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
      fetchFactData()
    ]);
  }).then(() => {
    MathFactStore.emitChange();
  }).done();
};


var fetchStoredData = function() {
  return fetchUserData().then(() => {
    return Promise.all([
      fetchPoints(),
      fetchFactData(),
    ]);
  }).then(() => {
    _loaded = true;
    MathFactStore.emitChange();
  }).done();
};

var MathFactStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire database of Math Facts
   * @return {object}
   */
  isLoaded: function() {
    return _isLoaded;
  },

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
    return _userList[_activeUser];
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

    case MathFactsConstants.INITIALIZE:
      fetchStoredData();
      break;

    case MathFactsConstants.FACT_DATA_ADD:
      var operation = action.operation;
      var data = action.data;
      if (!_.isEmpty(data)) {
        addAttempts(operation, data);
      }
      break;

    case MathFactsConstants.POINTS_ADD:
      var amount = action.amount;
      addPoints(amount);
      break;

    case MathFactsConstants.DATA_CLEAR:
      clearData();
      break;

    case MathFactsConstants.USERS_ADD:
      var newUserName = action.name;
      addUser(newUserName);
      break;

    case MathFactsConstants.USERS_CHANGE_NAME:
      var newUserName = action.name;
      changeUserName(newUserName);
      break;

    case MathFactsConstants.USERS_CHANGE_ACTIVE_USER:
      var id = action.id;
      changeActiveUser(id);
      break;

    default:
      // no op
  }
});

module.exports = MathFactStore;