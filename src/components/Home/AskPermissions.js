import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {Text, View, Button, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';
const {width, height} = Dimensions.get('window');

const AskPermissions = ({onSuccess}) => {
  const askPermissions = async () => {
    try {
      let check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!check) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onSuccess(true);
        } else {
          onSuccess(false);
        }
      } else {
        onSuccess(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    askPermissions();
  });
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_15,
      }}>
      <Icon
        name="cog-outline"
        style={{color: '#aaa', fontSize: width / 5, marginTop: width / 5}}
      />
      <Text style={{color: 'white', margin: width / 16, fontSize: width / 20}}>
        Grant Required Permissions
      </Text>
      <TouchableOpacity activeOpacity={0.8} onPress={askPermissions}>
        <View
          style={{
            height: width / 10,
            width: width / 3,
            borderRadius: width / 48,
            backgroundColor: COLORS.GRAY_40,
          }}>
          <Text
            style={{
              flex: 1,
              color: '#eee',
              fontSize: width / 20,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Grant
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AskPermissions;
