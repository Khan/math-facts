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

const ModeSelection = React.createClass({
  propTypes: {
    operation: React.PropTypes.string.isRequired,
    setOperation: React.PropTypes.func.isRequired,
  },

  render: function () {
    const {
      operation,
      setOperation,
    } = this.props;

    return (
      <View style={styles.toggleButtons}>
        <Button
          text='Addition'
          color={operation === 'addition' ? undefined : '#ddd'}
          small={true}
          wrapperStyle={[styles.toggleButtonWrapper]}
          onPress={() => setOperation('addition')} />
        <Button
          text='Multiplication'
          color={operation === 'multiplication' ? undefined : '#ddd'}
          small={true}
          wrapperStyle={[styles.toggleButtonWrapper]}
          onPress={() => setOperation('multiplication')} />
      </View>
    );
  },
});

const NewUser = React.createClass({
  propTypes: {
    addUser: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      newUserName: '',
    };
  },
  handleSubmitEditing: function() {
    this.props.addUser(this.state.newUserName);
    this.setState({
      newUserName: '',
    });
  },
  render: function () {
    return (
      <View>
        <TextInput
          autoCapitalize='words'
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
          small={true}
          onPress={this.handleSubmitEditing}
        />
      </View>
    );
  },
});

const ChangeUserName = React.createClass({
  propTypes: {
    changeUserName: React.PropTypes.func.isRequired,
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
  },
  render: function () {
    return (
      <View>
        <TextInput
          autoCapitalize='words'
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
          small={true}
          onPress={this.handleSubmitEditing}
        />
      </View>
    );
  },
});

const UserSelection = React.createClass({
  propTypes: {
    addUser: React.PropTypes.func.isRequired,
    changeActiveUser: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    userList: React.PropTypes.array.isRequired,
  },

  render: function () {
    const {
      addUser,
      changeActiveUser,
      user,
      userList,
    } = this.props;

    return (
      <View>
        <View style={styles.settingsSection}>
          <AppText style={styles.heading}>Switch Players</AppText>
          {_.map(userList, (curUser) => {
            return (
              <Button
                key={curUser.id}
                text={curUser.name}
                small={true}
                style={[
                  styles.settingsButton,
                  (curUser.id === user.id) && styles.activeSettingsButton
                ]}
                onPress={() => {
                  changeActiveUser(curUser.id);
                }}/>
            )
          })}
        </View>
        <View style={styles.settingsSection}>
          <AppText style={styles.heading}>Add a New Player</AppText>
          <NewUser addUser={addUser} />
        </View>
      </View>
    );
  },
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

  render: function () {
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

    return (
      <ScrollView ref='scrollView' contentContainerStyle={styles.scrollView}>

        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>

        <View style={styles.content}>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Mode</AppText>
            <ModeSelection operation={operation} setOperation={setOperation} />
          </View>

          <UserSelection
            addUser={addUser}
            user={user}
            userList={userList}
            changeActiveUser={changeActiveUser} />

          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Change Nickname</AppText>
            <ChangeUserName user={user} changeUserName={changeUserName} />
          </View>

          <View style={styles.settingsSection}>
            <AppText style={styles.uuidText}>
              {uuid}
            </AppText>
          </View>

        </View>
      </ScrollView>
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

  scrollView: {
    // Leave space for the keyboard
    paddingBottom: 270
  },
  settingsSection: {
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    margin: 10,
    marginTop: 0,
    fontSize: 20,
  },
  input: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center'
  },
  settingsButton: {
    borderColor: '#fff',
    borderWidth: 2,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 2,
    marginRight: 2,
    padding: 10,
  },
  activeSettingsButton: {
    borderColor: 'rgba(0, 0, 0, 0.5)'
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