'use strict';

import _ from 'underscore';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import Firebase from 'firebase';
import React from 'react-native';
import UuidGenerator from 'uuid';

const AsyncStorage = React.AsyncStorage;

import AppDispatcher from '../dispatcher/AppDispatcher';
import firebaseURL from '../firebase-url.js';
import MathFactsConstants from '../constants/MathFactsConstants';

const CHANGE_EVENT = 'change';


/*
 * Default Data
 */

/*
 * _data['factData'] = {
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
const defaultFactData = {
  'multiplication': null,
  'addition': null,
  'typing': null,
};

/*
 * Users are stored as an object with their id (int) and their name (string).
 * The UserList is an array of user objects
 */
const makeUser = function(userId, userName) {
  return {
    id: userId,
    name: userName,
    deleted: false,
    operation: 'multiplication',
    time: 60,
  };
};

const makeDefaultUser = function() {
  return makeUser(0, 'Player');
};

let _data = {
  isLoaded: false,
  /*
   * Each Installation of the app has a uuid that (hopefully) makes it unique.
   *
   * We use the uuid as this installation's ID on Firebase.
   */
  uuid: null,

  // The active user is the key of the user in the userList
  activeUser: 0,
  userList: [makeDefaultUser()],
  points: 0,
  scores: [],

  factData: defaultFactData,
};


/*
 * Users
 */
const createKey = function(input) {
  const key = _data['activeUser'] + '-' + input;
  return key;
};

const addUser = function(userName) {
  const userId = _data['userList'].length;
  const newUser = makeUser(userId, userName);
  _data['userList'].push(newUser);
  changeActiveUser(userId);
  MathFactStore.emitChange();
  updateUserData().done();
};

const changeUserName = function(userName) {
  _data['userList'][_data['activeUser']].name = userName;
  MathFactStore.emitChange();
  updateUserData().done();
};

const changeActiveUser = function(id) {
  _data['activeUser'] = id;
  _data['_isLoaded'] = false;
  updateUserData().then(fetchStoredData).done();
};

const setOperation = function(newOperation) {
  _data['userList'][_data['activeUser']].operation = newOperation;
  MathFactStore.emitChange();
  updateUserData().done();
};

const setTime = function(newTime) {
  _data['userList'][_data['activeUser']].time = newTime;
  MathFactStore.emitChange();
  updateUserData().done();
};

const updateUserData = function() {
  return Promise.all([
    AsyncStorage.setItem('activeUser', _data['activeUser'].toString()),
    AsyncStorage.setItem('userList', JSON.stringify(_data['userList'])),
  ]);
};

/*
 * Points
 */
const addPoints = function(amount) {
  _data['points'] += amount;
  const d = new Date();
  _data['scores'].push({score: amount, date: d.getTime()});
  MathFactStore.emitChange();
  updateStoredPoints();
};

const updateStoredPoints = function() {
  Promise.all([
    AsyncStorage.setItem(createKey('points'), _data['points'].toString()),
    AsyncStorage.setItem(createKey('scores'), JSON.stringify(_data['scores'])),
  ]).then(() => {
    updateRemoteStore();
  }).done();
};


/*
 * Adds fact attempts to the data store
 * Takes and operation and data as an array of attempts in the form:
 * [{inputs: [1, 2], data: {...}}, {inputs: [7, 4], data: {...}}]
 *
 */
const addAttempts = function(operation, data) {
  _.each(data, (attempt) => {
    const inputs = attempt.inputs;
    const attemptData = attempt.data;

    // Initialize the row if it's empty
    if (_data['factData'][operation][inputs[0]] == null) {
      _data['factData'][operation][inputs[0]] = [];
    }

    if (inputs.length === 1) {
      // If this operation takes a single input:
      _data['factData'][operation][inputs[0]].push(attempt);
    } else if (inputs.length === 2) {
      // If this operation takes two inputs:
      if (_data['factData'][operation][inputs[0]][inputs[1]] == null) {
        _data['factData'][operation][inputs[0]][inputs[1]] = [];
      }
      _data['factData'][operation][inputs[0]][inputs[1]].push(attemptData);
    }
  });
  updateStoredFactData();
};

const updateStoredFactData = function() {
  const key = createKey('factData');
  const value = JSON.stringify(_data['factData']);
  AsyncStorage.setItem(key, value).then(() => {
    updateRemoteStore();
  }).done();
};


/*
 * Update remote firebase storage
 */
const updateRemoteStore = function() {
  const uuid = _data['uuid'];
  if (firebaseURL && firebaseURL.length && uuid) {
    const firebaseRef = new Firebase(firebaseURL);

    const userRef = firebaseRef.child(uuid).child(_data['activeUser']);
    userRef.update({
      user: _data['userList'][_data['activeUser']],
      points: _data['points'],
      scores: _data['scores'],
      factData: _data['factData'],
    });
  }
};


// Clear all data
const clearData = function() {
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


/*
 * Fetch data from AsyncStorage and load it into _data
 */
const fetchUserData = function() {
  return Promise.all([
    AsyncStorage.getItem('uuid').then((storedUuid) => {
      // If we already have a uuid in _data then we don't need to do anything
      if (_data['uuid'] != null) {
        return;
      };

      // If the stored uuid exists then we should use that
      if (storedUuid != null) {
        _data['uuid'] = storedUuid;
        return;
      };

      // If we don't have a uuid at all we should make one!
      _data['uuid'] = UuidGenerator.v1();
      return AsyncStorage.setItem('uuid', _data['uuid']);
    }),
    AsyncStorage.getItem('activeUser').then((user) => {
      _data['activeUser'] = (user == null) ? _data['activeUser'] : user;
    }),
    AsyncStorage.getItem('userList').then((userList) => {
      let ret = _data['userList'];
      if (userList != null) {
        ret = JSON.parse(userList).map((userData) => {
          // Fill in default values and then overwrite with new ones
          return {
            ...makeDefaultUser(),
            ...userData,
          };
        });
      }
      _data['userList'] = ret;
    }),
  ]);
};

const fetchPoints = function() {
  return Promise.all([
    AsyncStorage.getItem(createKey('points')).then((points) => {
      _data['points'] = (points == null) ? 0 : parseInt(points);
    }),
    AsyncStorage.getItem(createKey('scores')).then((scores) => {
      let ret = [];
      if (scores != null) {
        ret = JSON.parse(scores).map((scoreData) => {
          if (typeof scoreData === 'number') {
            return { score: scoreData, date: null };
          }
          return { score: scoreData.score, date: scoreData.date };
        });
      }
      _data['scores'] = ret;
    }),
  ]);
};

const fetchFactData = function() {
  return AsyncStorage.getItem(createKey('factData')).then((factData) => {
    const newFactData = {};
    factData = JSON.parse(factData);
    if (factData == null) {
      factData = defaultFactData;
    }
    _.each(defaultFactData, (defaultData, operation) => {
      const data = factData[operation];
      newFactData[operation] = (data == null) ? [] : data;
    });
    _data['factData'] = newFactData;
  });
};

const fetchStoredData = function() {
  return fetchUserData().then(() => {
    return Promise.all([
      fetchPoints(),
      fetchFactData(),
    ]);
  }).then(() => {
    _data['isLoaded'] = true;
    MathFactStore.emitChange();
  }).done();
};


/*
 * Math Facts Store
 */
const MathFactStore = assign({}, EventEmitter.prototype, {

  getStoreData: function() {
    const data = _.clone(_data);
    data['user'] = _data['userList'][_data['activeUser']];
    return data;
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
      const operation = action.operation;
      const data = action.data;
      if (!_.isEmpty(data)) {
        addAttempts(operation, data);
      }
      break;

    case MathFactsConstants.POINTS_ADD:
      const amount = action.amount;
      addPoints(amount);
      break;

    case MathFactsConstants.DATA_CLEAR:
      clearData();
      break;

    case MathFactsConstants.USERS_ADD:
      const name = action.name;
      addUser(name);
      break;

    case MathFactsConstants.USERS_CHANGE_NAME:
      const newUserName = action.name;
      changeUserName(newUserName);
      break;

    case MathFactsConstants.USERS_CHANGE_ACTIVE_USER:
      const id = action.id;
      changeActiveUser(id);
      break;

    case MathFactsConstants.OPERATION_CHANGE:
      const newOperation = action.operation;
      setOperation(newOperation);
      break;

    case MathFactsConstants.TIME_CHANGE:
      const newTime = action.time;
      setTime(newTime);
      break;

    default:
      // no op
  }
});

module.exports = MathFactStore;