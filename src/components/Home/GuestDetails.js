import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import {StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import * as COLORS from '../../constants/colors';

const GuestDetails = ({isWVLoading, blab_count, navigation}) => {
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            margin: 10,
            marginTop: 20,
            borderColor: COLORS.DIS_PRIMARY_COLOR,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderRadius: 15,
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              alignSelf: 'center',
              margin: 15,
              marginBottom: 10,
            }}>
            Want to share Private posts?
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              alignSelf: 'center',
              marginHorizontal: 35,
            }}>
            When you connect Instagram, you can share private posts of the
            accounts you follow.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <Icon.Button
              disabled={isWVLoading}
              name="logo-instagram"
              backgroundColor={isWVLoading ? '#555' : '#2196F3'}
              marginHorizontal={10}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              <Text style={{color: 'white'}}>
                {isWVLoading
                  ? '          Loading          '
                  : 'Connect Instagram'}
              </Text>
            </Icon.Button>
          </View>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View
              style={{
                height: 32,
                width: 32,
                borderRadius: 25,
                borderTopEndRadius: 0,
                borderTopStartRadius: 0,
                marginHorizontal: 10,
                borderWidth: 2,
                borderColor: COLORS.DIS_PRIMARY_COLOR,
              }}
              onPress={() => {}}>
              <Icon
                name="help-outline"
                style={{
                  flex: 1,
                  fontSize: 18,
                  color: 'white',
                  alignSelf: 'center',
                  textAlignVertical: 'center',
                }}
                onPress={() => {
                  navigation.navigate('LoginScreen');
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={Styles.statNum}>
            {blab_count}
            {'\n'}
            <Text style={{fontSize: 15}}>blabbed</Text>
          </Text>
        </View>
      </View>
    </>
  );
};

const Styles = StyleSheet.create({
  displayPic: {
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: 'contain',
    margin: 'auto',
    marginTop: 25,
    alignSelf: 'center',
  },
  statNum: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default GuestDetails;
