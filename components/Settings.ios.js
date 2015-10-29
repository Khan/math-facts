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
    };
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
      const activeStyles = curUser.id === user.id ?
                            styles.activeSettingsButton : '';
      return (
        <Button
          key={curUser.id}
          text={curUser.name}
          small={true}
          style={[styles.settingsButton, activeStyles]}
          onPress={() => {
            changeActiveUser(curUser.id);
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
                color={operation === 'addition' ? null : '#ddd'}
                small={true}
                wrapperStyle={styles.toggleButtonWrapper}
                onPress={() => setOperation('addition')} />
              <Button
                text='Multiplication'
                color={operation === 'multiplication' ? null : '#ddd'}
                small={true}
                wrapperStyle={styles.toggleButtonWrapper}
                onPress={() => setOperation('multiplication')} />
            </View>
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Change User</AppText>
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
                  userName: text
                });
              }}
              ref='input'
              onFocus={() => {
                this.refs.scrollView.scrollResponderScrollNativeHandleToKeyboard(
                  React.findNodeHandle(this.refs.input)
                );
              }}
              onSubmitEditing={(event) => {
                changeUserName(this.state.userName);
              }}
            />
          </View>
          <View style={styles.settingsSection}>
            <AppText style={styles.heading}>Add New User</AppText>
            <TextInput
              autoCapitalize='words'
              returnKeyType='done'
              style={styles.input}
              onSubmitEditing={(event) => {
                addUser(event.nativeEvent.text);
              }}
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