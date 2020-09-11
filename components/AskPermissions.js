import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
        backgroundColor: 'black',
      }}>
      <Icon name="cog-outline" style={{color: '#aaa', fontSize: 80}} />
      <Text style={{color: 'white', margin: 20}}>
        Grant Required Permissions
      </Text>
      <TouchableOpacity activeOpacity={0.8} onPress={askPermissions}>
        <View
          style={{
            height: 35,
            width: 70,
            borderRadius: 5,
            backgroundColor: '#333',
          }}>
          <Text
            style={{
              color: '#eee',
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
            }}>
            Grant
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AskPermissions;
