'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  Navigator,
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
import SH from '../helpers/style-helpers';

const SettingsWrapper = React.createClass({
  propTypes: {
    goBack: React.PropTypes.func.isRequired,
    style: View.propTypes.style,
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
    time: React.PropTypes.number.isRequired,
    setTime: React.PropTypes.func.isRequired,
  },

  setTime: function(time) {
    return () => {
      this.props.setTime(time);
    };
  },
  render: function () {
    const {
      goBack,
      time,
    } = this.props;

    const timeOptions = [20, 30, 60, 90, 120];
    let idx = 0;

    return (
      <SettingsWrapper goBack={goBack}>
        <AppText style={styles.headingText}>
          How long do you want each game to be?
        </AppText>
        {timeOptions.map((value) => {
          idx++;
          return <CheckButton
            key={idx}
            text={`${value} seconds`}
            active={time === value}
            last={idx === timeOptions.length}
            onPress={this.setTime(value)} />;
        })}
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
          style={styles.submitButton}
          text="Save!"
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
        <AppText style={styles.headingText}>
          What's your new name?
        </AppText>
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
          style={styles.submitButton}
          text="Save!"
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

  render: function() {
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

    return (
      <Navigator
        initialRoute={{name: 'settings'}}
        renderScene={(route, navigator) => {
          if (route.name === 'addNewUser') {
            return <AddNewUser
              addUser={addUser}
              goBack={navigator.popToTop} />
          }
          if (route.name === 'changeUserName') {
            return <ChangeUserName
              changeUserName={changeUserName}
              goBack={navigator.popToTop}
              user={user} />
          }
          if (route.name === 'modeSelection') {
            return <ModeSelection
              goBack={navigator.popToTop}
              operation={operation}
              setOperation={setOperation} />
          }
          if (route.name === 'timeSelection') {
            return <TimeSelection
              goBack={navigator.popToTop}
              time={time}
              setTime={setTime} />
          }
          if (route.name === 'userSelection') {
            return <UserSelection
              changeActiveUser={changeActiveUser}
              goBack={navigator.popToTop}
              showAddNewUser={() => navigator.push({name: 'addNewUser'})}
              user={user}
              userList={userList} />
          }
          return <SettingsHome
            navigator={navigator}

            goBack={goBack}
            operation={operation}
            showChangeUserName={() => navigator.push({name: 'changeUserName'})}
            showModeSelection={() => navigator.push({name: 'modeSelection'})}
            showTimeSelection={() => navigator.push({name: 'timeSelection'})}
            showUserSelection={() => navigator.push({name: 'userSelection'})}
            time={time}
            user={user}
            uuid={uuid}
          />;
        }}
      />
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
    color: SH.colors.grey68,
    fontSize: 20,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  headingTextEmphasis: {
    color: SH.colors.grey25,
  },

  settingsWrapper: {
    flex: 1,
    backgroundColor: SH.colors.backgroundColor,
  },
  settingsSection: {
    marginBottom: 20,
  },

  input: {
    backgroundColor: SH.colors.white,
    borderColor: SH.colors.grey85,
    height: 50,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    textAlign: 'center'
  },

  submitButton: {
    backgroundColor: SH.colors.active,
    borderColor: SH.colors.activeShadow,
    borderBottomWidth: 4,
  },

  uuidText: {
    color: SH.colors.grey68,
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