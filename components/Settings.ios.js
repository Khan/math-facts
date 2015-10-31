'use strict';

import _ from 'underscore';

import React from 'react-native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

import Button from '../components/Button.ios';
import BackButton from '../components/BackButton.ios';

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
      userName: this.props.user.name,
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

    const userSelection = _.map(userList, (curUser) => {
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
            this.setState({
              userName: curUser.name
            });
          }}/>
      );
    });

    return (
      <ScrollView ref='scrollView' contentContainerStyle={styles.scrollView}>
        <View style={styles.topRow}>
          <BackButton onPress={goBack} />
        </View>
        <View style={styles.content}>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Mode</AppText>
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
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Switch Players</AppText>
            {userSelection}
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Change Nickname</AppText>
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
              onFocus={() => {
                this.refs.scrollView.scrollResponderScrollNativeHandleToKeyboard(
                  React.findNodeHandle(this.refs.input)
                );
              }}
              onSubmitEditing={() => {
                changeUserName(this.state.userName);
              }}
            />
            <Button
              text="Change my nickname!"
              small={true}
              onPress={() => {
                changeUserName(this.state.userName);
              }}
            />
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Add a New Player</AppText>
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