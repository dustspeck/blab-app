import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';

const ThemedMenu = (props) => {
  const {width, height} = Dimensions.get('window');

  return (
    <Modal
      visible={props.visible}
      transparent={true}
      onRequestClose={() => {
        props.setVisible(false);
      }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        onPress={() => {
          props.setVisible(false);
        }}>
        <View flex={1} justifyContent="center">
          <View
            style={{
              height: null,
              width: '75%',
              borderRadius: 10,
              backgroundColor: '#252525',
              alignSelf: 'center',
              padding: 25,
            }}>
            <Text
              style={{
                color: '#eee',
                fontWeight: 'bold',
                fontSize: width / 18,
                marginBottom: 10,
              }}>
              Account Settings
            </Text>
            <TouchableOpacity
              style={{marginVertical: 5}}
              activeOpacity={0.8}
              onPress={() => {
                props.setVisible(false);
                props.navigation.navigate('LoginScreen');
              }}>
              <Text
                style={{
                  color: '#eee',
                  fontSize: width / 20,
                  marginVertical: 10,
                }}>
                Open Session
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginVertical: 5}}
              activeOpacity={0.8}
              onPress={() => {
                props.onLogout();
                props.setVisible(false);
              }}>
              <Text
                style={{
                  color: COLORS.ALERT,
                  fontSize: width / 20,
                  marginVertical: 10,
                }}>
                {'Logout  '}
                <Icon
                  name="exit-outline"
                  style={{
                    color: COLORS.ALERT,
                    fontSize: width / 20,
                  }}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ThemedMenu;
