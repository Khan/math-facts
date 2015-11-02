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
import BackButton from '../components/BackButton';
import RowButton from '../components/RowButton';

const ModeSelection = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    operation: React.PropTypes.string.isRequired,
    setOperation: React.PropTypes.func.isRequired,
  },

  setOperation: function(operation) {
    return () => {
      this.props.setOperation(operation);
      this.props.goBack();
    };
  },
  render: function () {
    const {
      goBack,
      operation,
    } = this.props;

    return (
      <View>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

        <AppText style={styles.headingText}>
          What do you want to practice?
        </AppText>
        <View style={styles.toggleButtons}>
          <Button
            text='Addition'
            color={operation === 'addition' ? undefined : '#ddd'}
            wrapperStyle={[styles.toggleButtonWrapper]}
            onPress={this.setOperation('addition')} />
          <Button
            text='Multiplication'
            color={operation === 'multiplication' ? undefined : '#ddd'}
            wrapperStyle={[styles.toggleButtonWrapper]}
            onPress={this.setOperation('multiplication')} />
        </View>
      </View>
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
      <View>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

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
      </View>
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
      <View>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

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
      </View>
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
      <View style={styles.scrollViewContainer}>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

        <AppText style={styles.headingText}>Who are you?</AppText>

        <RowButton
          onPress={showAddNewUser}
          text={'I\'m a new player!'} />

        <ScrollView>
          {_.map(userList, (curUser) => {
            return (
              <Button
                key={curUser.id}
                text={curUser.name}
                style={[
                  styles.userListButton,
                  (curUser.id === user.id) && styles.activeUserListButton
                ]}
                onPress={() => {
                  changeActiveUser(curUser.id);
                  goBack();
                }}/>
            )
          })}
        </ScrollView>

      </View>
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
      showUserSelection,
      user,
      uuid,
    } = this.props;

    const printOperation = operation.slice(0, 1).toUpperCase() +
      operation.slice(1);
    return (
      <View>

        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

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


        <View style={styles.settingsSection}>
          <AppText style={styles.uuidText}>
            {uuid}
          </AppText>
        </View>

      </View>
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
        showUserSelection={this.showUserSelection}
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

  scrollViewContainer: {
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