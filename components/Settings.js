'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText';

import Button from '../components/Button';
import CheckButton from '../components/CheckButton';
import BackButton from '../components/BackButton';
import RowButton from '../components/RowButton';

const SettingsWrapper = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
  },
  render: function() {
    return (
      <View style={[this.props.style, styles.settingsWrapper]}>
        <View style={styles.topRow}>
          <BackButton onPress={this.props.goBack} />
        </View>
        {this.props.children}
      </View>
    );
  },
});

const ModeSelection = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    operation: React.PropTypes.string.isRequired,
    setOperation: React.PropTypes.func.isRequired,
  },

  setOperation: function(operation) {
    return () => {
      this.props.setOperation(operation);
    };
  },
  render: function () {
    const {
      goBack,
      operation,
    } = this.props;

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>
          What do you want to practice?
        </AppText>
        <CheckButton
          active={operation === 'addition'}
          onPress={this.setOperation('addition')}
          text='Addition' />
        <CheckButton
          active={operation === 'multiplication'}
          last={true}
          onPress={this.setOperation('multiplication')}
          text='Multiplication' />
      </SettingsWrapper>
    );
  },
});


const TimeSelection = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    time: React.PropTypes.string.isRequired,
    setTime: React.PropTypes.func.isRequired,
  },

  setTime: function(time) {
    return () => {
      this.props.setTime(time);
      this.props.goBack();
    };
  },
  render: function () {
    const {
      goBack,
      time,
    } = this.props;

    const timeOptions = [20, 30, 60, 90, 120];

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>
          How many seconds do you want each game to be?
        </AppText>
        <View style={styles.toggleButtons}>
        {timeOptions.map((value) => {
          return <Button
            text={value}
            color={time === value ? undefined : '#ddd'}
            wrapperStyle={[styles.toggleButtonWrapper]}
            onPress={this.setTime(value)} />
        })}
        </View>
      </SettingsWrapper>
    );
  },
});

const AddNewUser = React.createClass({
  propTypes: {
    addUser: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      newUserName: '',
    };
  },
  handleSubmitEditing: function() {
    this.props.addUser(this.state.newUserName);
    this.props.goBack();
  },
  render: function () {
    const {
      goBack,
    } = this.props;

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>Hi! What's your name?</AppText>
        <TextInput
          autoCapitalize='words'
          autoFocus={true}
          returnKeyType='done'
          style={styles.input}
          value={this.state.newUserName}
          onChangeText={(text) => {
            this.setState({
              newUserName: text,
            });
          }}
          onSubmitEditing={this.handleSubmitEditing}
        />
        <Button
          text="Add this player!"
          onPress={this.handleSubmitEditing}
        />
      </SettingsWrapper>
    );
  },
});

const ChangeUserName = React.createClass({
  propTypes: {
    changeUserName: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      userName: this.props.user.name,
    };
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      userName: newProps.user.name,
    });
  },
  handleSubmitEditing: function() {
    this.props.changeUserName(this.state.userName);
    this.props.goBack();
  },
  render: function () {
    const {
      goBack,
    } = this.props;

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>What's your new name?</AppText>
        <TextInput
          autoCapitalize='words'
          autoFocus={true}
          returnKeyType='done'
          style={styles.input}
          value={this.state.userName}
          onChangeText={(text) => {
            this.setState({
              userName: text,
            });
          }}
          ref='input'
          onSubmitEditing={this.handleSubmitEditing}
        />
        <Button
          text="Change my nickname!"
          onPress={this.handleSubmitEditing}
        />
      </SettingsWrapper>
    );
  },
});

const UserSelection = React.createClass({
  propTypes: {
    changeActiveUser: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    showAddNewUser: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    userList: React.PropTypes.array.isRequired,
  },

  render: function () {
    const {
      changeActiveUser,
      goBack,
      showAddNewUser,
      user,
      userList,
    } = this.props;

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>
          Who are you?
        </AppText>

        <RowButton
          onPress={showAddNewUser}
          text={`I'm a new player!`} />

        <ScrollView>
          {_.map(userList, (curUser, idx) => {
            return (
              <CheckButton
                active={curUser.id === user.id}
                key={curUser.id}
                last={idx === userList.length - 1}
                onPress={() => {
                  changeActiveUser(curUser.id);
                }}
                text={curUser.name}
              />
            );
          })}
        </ScrollView>
      </SettingsWrapper>
    );
  },
});

const SettingsHome = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    operation: React.PropTypes.string.isRequired,
    showChangeUserName: React.PropTypes.func.isRequired,
    showModeSelection: React.PropTypes.func.isRequired,
    showUserSelection: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    uuid: React.PropTypes.string.isRequired,
  },

  render: function () {
    const {
      goBack,
      operation,
      showChangeUserName,
      showModeSelection,
      showTimeSelection,
      showUserSelection,
      time,
      user,
      uuid,
    } = this.props;

    const printOperation = operation.slice(0, 1).toUpperCase() +
      operation.slice(1);

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>
          {'Hi '}
          <AppTextBold style={styles.headingTextEmphasis}>
            {user.name}
          </AppTextBold>
          {'!'}
        </AppText>

        <RowButton
          onPress={showChangeUserName}
          text='Change Nickname' />

        <RowButton
          onPress={showUserSelection}
          text='Switch Player' />

        <RowButton
          onPress={showModeSelection}
          text={`Change Mode (${printOperation})`} />

        <RowButton
          onPress={showTimeSelection}
          text={`Change Game Time (${time}s)`} />

        <View style={styles.settingsSection}>
          <AppText style={styles.uuidText}>
            {uuid}
          </AppText>
        </View>

      </SettingsWrapper>
    );
  }
});

const Settings = React.createClass({
  propTypes: {
    addUser: React.PropTypes.func.isRequired,
    changeActiveUser: React.PropTypes.func.isRequired,
    changeUserName: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    operation: React.PropTypes.string.isRequired,
    setOperation: React.PropTypes.func.isRequired,
    time: React.PropTypes.number.isRequired,
    setTime: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    userList: React.PropTypes.array.isRequired,
    uuid: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      currentScreen: 'home',
    };
  },
  showScreen: function(screen) {
    this.setState({
      currentScreen: screen,
    });
  },
  showSettingsHome: function(screen) {
    this.showScreen('home');
  },
  showAddNewUser: function() {
    this.showScreen('addNewUser');
  },
  showChangeUserName: function() {
    this.showScreen('changeUserName');
  },
  showModeSelection: function() {
    this.showScreen('modeSelection');
  },
  showTimeSelection: function() {
    this.showScreen('timeSelection');
  },
  showUserSelection: function() {
    this.showScreen('userSelection');
  },
  render: function() {
    const {
      currentScreen
    } = this.state;

    const {
      addUser,
      changeActiveUser,
      changeUserName,
      goBack,
      operation,
      setOperation,
      time,
      setTime,
      user,
      userList,
      uuid,
    } = this.props;

    if (currentScreen === 'addNewUser') {
      return <AddNewUser
        addUser={addUser}
        goBack={this.showSettingsHome} />
    }
    if (currentScreen === 'changeUserName') {
      return <ChangeUserName
        changeUserName={changeUserName}
        goBack={this.showSettingsHome}
        user={user} />
    }
    if (currentScreen === 'modeSelection') {
      return <ModeSelection
        goBack={this.showSettingsHome}
        operation={operation}
        setOperation={setOperation} />
    }
    if (currentScreen === 'timeSelection') {
      return <TimeSelection
        goBack={this.showSettingsHome}
        time={time}
        setTime={setTime} />
    }
    if (currentScreen === 'userSelection') {
      return <UserSelection
        changeActiveUser={changeActiveUser}
        goBack={this.showSettingsHome}
        showAddNewUser={this.showAddNewUser}
        user={user}
        userList={userList} />
    }

    return (
      <SettingsHome
        goBack={goBack}
        operation={operation}
        showAddNewUser={this.showAddNewUser}
        showChangeUserName={this.showChangeUserName}
        showModeSelection={this.showModeSelection}
        showTimeSelection={this.showTimeSelection}
        showUserSelection={this.showUserSelection}
        time={time}
        user={user}
        uuid={uuid} />
    );
  }
});

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  headingText: {
    color: '#999',
    fontSize: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  headingTextEmphasis: {
    color: '#555'
  },

  settingsWrapper: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    textAlign: 'center'
  },

  userListButton: {
    flex: 1,
    marginTop: 0,
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 2,
    padding: 10,
  },
  activeUserListButton: {
    backgroundColor: '#555',
  },
  uuidText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },

  toggleButtons: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  toggleButtonWrapper: {
    flex: 1
  },

});

module.exports = Settings;