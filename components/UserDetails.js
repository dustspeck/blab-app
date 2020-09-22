import React from 'react';
import {View, Text, Image, Button, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';

import verified_badge from '../public/assets/img/vbadge.png';
import private_badge from '../public/assets/img/pbadge.png';

const UserDetails = ({blab_count, ig_details, onLogout}) => {
  console.log(ig_details);

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red'
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          // backgroundColor: 'blue',
        }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'green'
          }}>
          {/* Top Bar */}
          <View style={{marginTop: 'auto'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text style={{color: 'white', fontSize: 18, alignSelf: 'center'}}>
                Logged in as
              </Text>
              <TouchableOpacity style={Styles.logoutButton} onPress={onLogout}>
                <Text style={{color: 'white'}}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 5,
            // backgroundColor: 'black'
          }}>
          <View
            style={{
              flex: 7,
              // backgroundColor: 'black',
              justifyContent: 'space-between',
            }}>
            {/* Profile Details */}
            <Image
              style={Styles.displayPic}
              source={{uri: ig_details.pp_url}}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                // backgroundColor: 'red',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  alignSelf: 'center',
                  margin: 10,
                }}>
                {ig_details.username}
              </Text>
              {ig_details.is_private && (
                <Image
                  style={{height: 20, width: 20, alignSelf: 'center'}}
                  source={private_badge}
                />
              )}
              {ig_details.is_verified && (
                <Image
                  style={{height: 20, width: 20, alignSelf: 'center'}}
                  source={verified_badge}
                />
              )}
            </View>
          </View>
          <View
            style={{
              flex: 4,
              //  backgroundColor: 'blue'
            }}>
            {/* Profile Stats */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 50,
                alignItems: 'center',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
              <Text style={Styles.statNum}>
                {blab_count}
                {'\n'}
                <Text style={{fontSize: 15, fontWeight: 'normal'}}>
                  blabbed
                </Text>
              </Text>
              <Text style={Styles.statNum}>
                {ig_details.followers_count}
                {'\n'}
                <Text style={{fontSize: 15, fontWeight: 'normal'}}>
                  followers
                </Text>
              </Text>
              <Text style={Styles.statNum}>
                {ig_details.following_count}
                {'\n'}
                <Text style={{fontSize: 15, fontWeight: 'normal'}}>
                  following
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  displayPic: {
    height: 90,
    width: 90,
    borderRadius: 45,
    resizeMode: 'contain',
    margin: 'auto',
    marginTop: 10,
    alignSelf: 'center',
  },
  statNum: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#2196F3',
    height: 30,
    borderRadius: 3,
    padding: 5,
    paddingHorizontal: 10,
  },
});

export default UserDetails;
