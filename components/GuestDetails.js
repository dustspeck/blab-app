import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import {StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const GuestDetails = ({blab_count, navigation}) => {
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
            borderColor: '#777',
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
            Login using Instagram
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              alignSelf: 'center',
              marginHorizontal: 35,
            }}>
            When you login to Instagram, you can share private posts of the
            accounts you follow.
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            {/* <Button
              title="Login using Instagram"
              style={{width: 50, margin: 'auto'}}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}
            /> */}
            <Icon.Button
              name="logo-instagram"
              backgroundColor="#2196F3"
              marginHorizontal={10}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              <Text style={{color: 'white'}}> Connect Instagram</Text>
            </Icon.Button>
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
